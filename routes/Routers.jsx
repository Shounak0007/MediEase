import React from "react";
import Home from "../src/pages/Home";
import Services from "../src/pages/Services";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Contact from "../src/pages/Contact";
import Doctors from "../src/pages/Doctors/Doctors";
import DoctorDetails from "../src/pages/Doctors/DoctorDetails";
import CheckoutSuccess from "../src/pages/Doctors/CheckoutSuccess";
import Prescription from '../src/Dashboard/doctor-account/prescriptionGenerator/Prescription'

import { Routes, Route } from "react-router-dom";
import MyAccount from "../src/Dashboard/user-account/MyAccount";
import Dashboard from "../src/Dashboard/doctor-account/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../src/Dashboard/admin-account/AdminDashboard";
import DocumentUpload from "../src/Dashboard/user-account/DocumentUpload";
import SendPrescription from "../src/Dashboard/doctor-account/prescriptionGenerator/SendPrescription";
import GenAi from "../src/pages/GenAi";


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/doctors" element={<ProtectedRoute allowedRoles={['patient',  'doctor']}><Doctors /></ProtectedRoute>} />
      <Route path="/doctors/:id" element={<ProtectedRoute allowedRoles={['patient',  'doctor']}><DoctorDetails /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<ProtectedRoute allowedRoles={['patient',  'doctor']}><Contact /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute allowedRoles={['patient' , 'doctor']}><Services /></ProtectedRoute>} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route path="/users/profile/me" element={<ProtectedRoute allowedRoles={['patient']}><MyAccount /></ProtectedRoute>} />
      <Route path="/users/profile/me/documents" element={<ProtectedRoute allowedRoles={['patient']}><DocumentUpload /></ProtectedRoute>} />
      <Route path="/doctors/profile/me" element={<ProtectedRoute allowedRoles={['doctor']}><Dashboard /></ProtectedRoute>} />      
      <Route path="/admin/dashboard/" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/doctors/profile/me/prescription" element={<ProtectedRoute allowedRoles={['doctor']}><Prescription /></ProtectedRoute>} /> 
     <Route path="/doctors/profile/me/sendprescription" element={<ProtectedRoute allowedRoles={['doctor']}><SendPrescription /></ProtectedRoute>} /> 
      <Route path="/users/profile/me/analysis" element={<ProtectedRoute allowedRoles={['patient']}><GenAi /></ProtectedRoute>} /> 
    </Routes>
    
  );
};

export default Routers;
