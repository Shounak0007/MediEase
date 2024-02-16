from flask import Flask, request
from twilio.rest import Client
import threading
import schedule
import time
import keys
import os
import re
from pdf2image import convert_from_path

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_pdf_to_png(pdf_file):
    images = convert_from_path(pdf_file,poppler_path=r"C:\Program Files\poppler-23.11.0\Library\bin")
    png_files = []
    for i, image in enumerate(images):
        png_file = os.path.join(app.config['UPLOAD_FOLDER'], f'page_{i}.png')
        image.save(png_file, 'PNG')
        png_files.append(png_file)
    return png_files

def send_message():
    os.system(f"tesseract {os.path.join(app.config['UPLOAD_FOLDER'], 'page_0.png')} tesseract-result")
    with open('tesseract-result.txt', 'r') as file:
        body = file.read()
            
    medicine_lines = re.findall(r"Tab\..+", body)
    medicine_lines_str = "\n".join(medicine_lines)

    note_match = re.search(r"Note from your doctor:(.*?)Follow up:", body, re.DOTALL)
    if note_match:
        note = note_match.group(1).strip()
        note = ' '.join(line.strip() for line in note.splitlines())
    else:
        note = ""

    message_body = f"\n{medicine_lines_str}\n\n{'Note from the doctor:' if note else ''}{note}"
        

    client = Client(keys.account_sid, keys.auth_token)

    message = client.messages.create(
        body=message_body,
        from_=keys.twilio_number,
        to=keys.target_number
    )

    print(message.body)

def schedule_task():
    schedule.every().day.at("12:20").do(send_message)
    schedule.every().day.at("15:05").do(send_message)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

scheduler_thread = threading.Thread(target=schedule_task)
scheduler_thread.start()

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part"
        file = request.files['file']
        if file.filename == '':
            return "No selected file"
        if file and allowed_file(file.filename):
            filename = "upload.pdf"
            pdf_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(pdf_file)
            png_files = convert_pdf_to_png(pdf_file)
            # send_message(png_files)
            return "File uploaded successfully and text extracted."
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == "__main__":
    app.run(debug=False, port=8080, host='0.0.0.0')
