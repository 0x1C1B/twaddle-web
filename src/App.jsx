import { Routes, Route, Navigate } from "react-router-dom";
import RouteProtector from "./components/organisms/RouteProtector";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" />} />
      <Route
        path="/chat"
        element={
          <RouteProtector>
            <Chat />
          </RouteProtector>
        }
      />
      <Route
        path="/profile"
        element={
          <RouteProtector>
            <Profile />
          </RouteProtector>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
