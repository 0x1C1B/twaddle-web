import { useEffect } from "react";
import StackTemplate from "../components/templates/StackTemplate";

export default function Profile() {
  useEffect(() => {
    document.title = "Twaddle Web | Profile";
  }, []);

  return <StackTemplate></StackTemplate>;
}
