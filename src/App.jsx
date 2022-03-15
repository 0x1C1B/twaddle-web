import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RouteProtector from "./components/organisms/RouteProtector";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { TwaddleChatProvider } from "./contexts/twaddle-chat";

export default function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
      <Route
        path="/rooms/:roomId"
        element={
          <RouteProtector>
            <TwaddleChatProvider>
              <Room />
            </TwaddleChatProvider>
          </RouteProtector>
        }
      />
      <Route
        path="/settings"
        element={
          <RouteProtector>
            <Settings />
          </RouteProtector>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}
