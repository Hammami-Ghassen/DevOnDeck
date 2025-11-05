import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './Pages/LandingPage.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';

function App() {
  return (
    <AdminDashboard/>
  );
}

export default App;
