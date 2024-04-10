import express from 'express'
import {updateDoctor , deleteDoctor , getAllDoctor , getSingleDoctor, getDoctorProfile} from '../Controllers/doctorController.js'
import { authenticate , restrict } from '../auth/verifyToken.js'
import reviewRouter from './review.js'
import axios from 'axios'
import qs from 'qs'

const router = express.Router()

router.use('/:doctorId/reviews' , reviewRouter)

router.get('/:id' , getSingleDoctor)
router.get('/' , getAllDoctor)
router.put('/:id' , authenticate , restrict(['doctor']), updateDoctor)
router.delete('/:id' , authenticate , restrict(['doctor']), deleteDoctor)

router.get('/profile/me' , authenticate , restrict(['doctor']) , getDoctorProfile)

router.post('/profile/me/sendprescription',async(req,res)=>{
    const url = req.body.url;
    try{
        var data = qs.stringify({
            "token": "j8a32jhvvhr5irb9",
            "to": 919307061335,
            "filename": "Prescription.pdf",
            "document": url,
            "caption": "Team-MediEase"
        });

        var config = {
            method: 'post',
            url: 'https://api.ultramsg.com/instance77224/messages/document',
            headers: {  
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            // console.log(JSON.stringify(response.data));
            res.status(200).json({success: true , message : "Prescription send Successfully"})
          })
          .catch(function (error) {
            console.log(error);
            res.status(500).json({success: false , message : "Prescription not sent"})
          });
    }
    catch(err){
        res.status(400).json({message:`error in multer: ${err}`})
    }
})

export default router;