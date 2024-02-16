import { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import useGetProfile from '../../hooks/useFetchData.jsx'
import { BASE_URL } from '../../config.js';



const DocumentUpload = ()=>{
    const {
        data,
        loading,
        error,
      } = useGetProfile(`${BASE_URL}/users/profile/me`);

      
  const [file, setFile] = useState('');
  const [images, setImage] = useState([]);

  useEffect(()=>{},[images])
  useEffect(()=>{getimg()},[])
  const upload = async () => {

    const formData = new FormData();
    formData.append('file', file);
    console.log('FormData:', formData);
    console.log(formData)
    try {
      const response = await axios.post(`${BASE_URL}/users/profile/me/documents/${data._id}`,formData);

      getimg();
    } catch (error) {
      console.log(error);
    }
  };


  const getimg = async() =>{
    const allImgs = await axios.get(`${BASE_URL}/users/profile/me/documents/${data._id}`)
    console.log(allImgs.data.images)
    setImage(allImgs.data.images)
  }
  return (
    <div>
      <div className='flex justify-center'>
        <input type="file" onChange={(e) =>{ 
          console.log(e.target.files[0])
          setFile(e.target.files[0])} }/>

        <button 
        type='button' 
        className='bg-blue-500 text-lg p-4 text-white rounded-md hover:bg-white hover:text-blue-500 hover:border-2 border-blue-500'
        onClick={upload}>Upload</button>
      </div>
      
      <table className='border-collapse border border-gray-400'>
  <thead>
    <tr>
      <th className='border border-gray-400 p-2'>Name</th>
      <th className='border border-gray-400 p-2'>Action</th>
    </tr>
  </thead>
  <tbody>
    {images.map((item, index) => (
      <tr key={item._id}>
        <td className='border border-b-gray-400 p-2'>{item.name.split(" ")[0]}</td>
        <td className='border border-b-gray-400 p-2'>
          <a 
            href={`http://localhost:5000/docs/${encodeURIComponent(item.name)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className='text-blue-800'
          >
            View Document
          </a>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
    );
}

export default DocumentUpload