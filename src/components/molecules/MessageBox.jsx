import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { StatusOnlineIcon, StatusOfflineIcon } from "@heroicons/react/solid";
import MessageInput from "./MessageInput";
import Message from "./Message";

/**
 * @typedef {object} MessageBoxProperties
 * @property {{id: string, name: string, description: string, createdAt: string}} room
 * @property {boolean} connecting
 * @property {boolean} connected
 * @property {string} error
 * @property {[{id: string, content: string, username: string, room: string, timestamp: string}]} messages
 * @property {(message: string) => void} onNewMessage
 */

/**
 * Constructs a message box component.
 *
 * @param {MessageBoxProperties} properties The message box properties
 * @returns Returns the message box component
 */
export default function MessageBox({
  room,
  connecting,
  connected,
  error,
  messages,
  onNewMessage,
}) {
  const chatBox = useRef();
  const [chatBoxStickyBottom, setChatBoxStickyBottom] = useState(true);
  const principal = useSelector((state) => state.auth.principal);

  const onSendMessage = (values, { resetForm }) => {
    onNewMessage(values.message);
    resetForm();
  };

  const onChatBoxScroll = () => {
    if (chatBox.current) {
      const isAtBottom =
        chatBox.current.scrollTop >=
        chatBox.current.scrollHeight - chatBox.current.offsetHeight;

      if (isAtBottom) {
        setChatBoxStickyBottom(true);
      } else {
        setChatBoxStickyBottom(false);
      }
    }
  };

  useEffect(() => {
    if (chatBoxStickyBottom) {
      chatBox.current.scrollTo(0, chatBox.current.scrollHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div className="flex flex-col grow bg-gray-100 dark:bg-gray-500">
      <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 dark:text-white flex justify-between">
        <nav className="rounded-md w-full">
          <ol className="list-reset flex">
            <li>
              <Link className="text-amber-500 hover:text-amber-400" to="/rooms">
                Rooms
              </Link>
            </li>
            <li>
              <span className="text-gray-500 mx-2">/</span>
            </li>
            <li className="text-gray-500">{room ? room.name : "Room"}</li>
          </ol>
        </nav>
        {connected && (
          <StatusOnlineIcon
            className="h-6 w-6 text-green-500"
            aria-hidden="true"
          />
        )}
        {!connected && (
          <StatusOfflineIcon
            className="h-6 w-6 text-red-500"
            aria-hidden="true"
          />
        )}
      </div>
      <div
        onScroll={onChatBoxScroll}
        ref={chatBox}
        className="grow h-0 overflow-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent dark:scrollbar-track-transparent px-3 py-4"
      >
        {connecting && !error && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {connected && (
          <div className="space-y-2 flex flex-col">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                principal={principal.username}
              />
            ))}
          </div>
        )}
      </div>
      <MessageInput onSubmit={onSendMessage} diabled={!connected} />
    </div>
  );
}
