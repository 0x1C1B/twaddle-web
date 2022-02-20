import { Routes, Route, Navigate } from "react-router-dom";
import RouteProtector from "./components/organisms/RouteProtector";
import Rooms from "./pages/Rooms";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rooms" />} />
      <Route path="*" element={<Navigate to="/404" />} />
      <Route
        path="/rooms"
        element={
          <RouteProtector>
            <Rooms />
          </RouteProtector>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}
