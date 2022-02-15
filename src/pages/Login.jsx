import { useEffect } from "react";
import StackTemplate from "../components/templates/StackTemplate";

export default function Login() {
  useEffect(() => {
    document.title = "Twaddle Web | Login";
  }, []);

  return <StackTemplate></StackTemplate>;
}
