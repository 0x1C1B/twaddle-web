import { useEffect } from "react";
import StackTemplate from "../components/templates/StackTemplate";

export default function Chat() {
  useEffect(() => {
    document.title = "Twaddle Web | Chat";
  }, []);

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600"></div>
    </StackTemplate>
  );
}
