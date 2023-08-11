import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import RouteProtector from './components/organisms/RouteProtector';
import {CurrentUserAvatarProvider} from './contexts/CurrentUserAvatarContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import VerifyUser from './pages/VerifyUser';
import Settings from './pages/Settings';

/**
 * The application's root component.
 *
 * @return {JSX.Element} Application's root component
 */
export default function App() {
  return (
    <CurrentUserAvatarProvider>
      <Routes>
        <Route path="*" element={<Navigate to="/not-found" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/not-found" element={<NotFound />} />
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
        <Route path="/verify-user/:verificationToken" element={<VerifyUser />} />
        <Route
          path="/settings"
          element={
            <RouteProtector>
              <Settings />
            </RouteProtector>
          }
        />
      </Routes>
    </CurrentUserAvatarProvider>
  );
}
