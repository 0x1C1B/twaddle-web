import { useEffect } from "react";
import StackTemplate from "../components/templates/StackTemplate";

export default function Register() {
  useEffect(() => {
    document.title = "Twaddle Web | Register";
  }, []);

  return <StackTemplate></StackTemplate>;
}
