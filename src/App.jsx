import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import RouteProtector from './components/organisms/RouteProtector';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

/**
 * The application's root component.
 *
 * @return {JSX.Element} Application's root component
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route
        path="/home"
        element={
          <RouteProtector>
            <Home />
          </RouteProtector>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
