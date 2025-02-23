import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Venues from '../pages/Venues';
import VenueDetails from '../pages/VenueDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';
import ManageVenues from '../pages/ManageVenues';
import Contact from '../pages/Contact';
import About from '../pages/About';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:id" element={<VenueDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bookings" 
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/manage-venues" 
        element={
          <ProtectedRoute requireManager>
            <ManageVenues />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;