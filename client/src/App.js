import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './Pages/LandingPage.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import DeveloperProfile from './Pages/DeveloperProfile.jsx';
import Forbidden from './Pages/Forbidden.jsx';
import Home from './Pages/Home.jsx';
import CreateOffer from './Pages/CreateOffer.jsx';
import OrganizationDashboard from "./Pages/OrganizationDashboard.jsx"
import OfferDetails from './Pages/offerDetails.jsx';
import ApplicantsList from './components/ApplicantsList.jsx'
import EditOffer from './Pages/EditOffer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/offers/:id" element={<OfferDetails />} />
        
        {/* All routes - backend controls access */}
        <Route path="/developer/:id" element={<DeveloperProfile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/organization/create-offer" element={<CreateOffer />} />
        <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
        <Route path="/organization/applicants/:offerId" element={<ApplicantsList />} />
        <Route path="/organization/edit-offer/:id" element={<EditOffer />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;