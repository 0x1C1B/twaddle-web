import { useRef, useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { StatusOnlineIcon, StatusOfflineIcon } from "@heroicons/react/solid";
import io from "socket.io-client";
import MessageInput from "../molecules/MessageInput";
import Message from "../molecules/Message";
import StatusInfo from "../molecules/StatusInfo";

export default function ChatBox({ room, ticket }) {
  const socketRef = useRef(null);

  const chatBox = useRef();

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const [error, setError] = useState(null);

  const [componentState, dispatchComponent] = useReducer(
    (state, action) => {
      if (action.type === "ADD_MESSAGE") {
        return { ...state, messages: [...state.messages, action.message] };
      }

      return state;
    },
    { messages: [] }
  );

  const principal = useSelector((state) => state.auth.principal);

  const onSendMessage = (values, { resetForm }) => {
    socketRef.current.emit("twaddle/room:send", { message: values.message });
    resetForm();
  };

  const onNewMessage = (message) => {
    const isAtBottom =
      chatBox.current.scrollTop >=
      chatBox.current.scrollHeight - chatBox.current.offsetHeight;

    dispatchComponent({
      type: "ADD_MESSAGE",
      message,
    });

    if (isAtBottom) {
      chatBox.current.scrollTo(0, chatBox.current.scrollHeight);
    }
  };

  // Responsible for establishing the connection on startup
  useEffect(() => {
    if (ticket) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      socketRef.current = io(process.env.REACT_APP_TWADDLE_WS_URI, {
        autoConnect: false,
        reconnection: false,
        transports: ["websocket"],
        query: {
          ticket,
        },
      });

      socketRef.current.on("connect", async () => {
        setConnecting(false);
        setConnected(true);
      });

      socketRef.current.on("disconnect", async (reason) => {
        setConnected(false);

        if (reason === "ping timeout" || reason === "transport error") {
          setError("The connection was unexpectedly lost.");
        }
      });

      socketRef.current.on("connect_error", (err) => {
        // eslint-disable-next-line no-console
        console.error("Socket connection error occurred", err);

        if (err.data && err.data.code === "AccountBlockedError") {
          setError("Your account is blocked, you can't participate in chats!");
        } else if (err.data && err.data.code === "AlreadyConnectedError") {
          setError(
            "It seems that there is already a connection, only one connection to the chat is allowed at a time!"
          );
        } else {
          setError("An unexpected error occurred, please retry!");
        }

        setConnecting(false);
      });

      socketRef.current.on("twaddle/error", (err) => {
        // eslint-disable-next-line no-console
        console.error("Socket business error occurred", err);

        if (err.code === "AlreadyConnectedError") {
          setError(
            "A session for the current user is already open. Only one session can be opened per user."
          );
        } else {
          setError("An unexpected error occurred, please retry!");
        }
      });

      setJoining(false);
      setJoined(false);
      setConnected(false);
      setError(null);

      setConnecting(true);

      socketRef.current.connect();
    }
  }, [ticket]);

  // Responsible for joining the chat room after connection established successfully
  useEffect(() => {
    if (connected && room) {
      socketRef.current.on("twaddle/room:joined", () => {
        setJoining(false);
        setJoined(true);
      });

      socketRef.current.on("twaddle/room:left", () => {
        setJoined(false);
      });

      setJoining(true);

      socketRef.current.emit("twaddle/room:join", { id: room.id });
    }
  }, [connected, room]);

  // Responsible for handling incoming messages and status updates
  useEffect(() => {
    if (joined) {
      socketRef.current.on("twaddle/room:message", (message) => {
        onNewMessage({ ...message, type: "message" });
      });

      socketRef.current.on(
        "twaddle/room:user-joined",
        ({ user: joinedUser }) => {
          onNewMessage({
            content: `'${joinedUser}' joined the room`,
            timestamp: new Date().toISOString(),
            type: "status",
          });
        }
      );

      socketRef.current.on("twaddle/room:user-left", ({ user: leftUser }) => {
        onNewMessage({
          content: `'${leftUser}' left the room`,
          timestamp: new Date().toISOString(),
          type: "status",
        });
      });
    }
  }, [joined]);

  // Responsible for closing the connection on leave
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

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
        {connected && joined && (
          <StatusOnlineIcon
            className="h-6 w-6 text-green-500"
            aria-hidden="true"
          />
        )}
        {(!connected || !joined) && (
          <StatusOfflineIcon
            className="h-6 w-6 text-red-500"
            aria-hidden="true"
          />
        )}
      </div>
      <div
        ref={chatBox}
        className="grow h-0 overflow-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent dark:scrollbar-track-transparent px-3 py-4"
      >
        {(connecting || joining) && !error && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {connected && joined && (
          <div className="space-y-2 flex flex-col">
            {componentState.messages.map((message) =>
              message.type === "message" ? (
                <Message
                  key={message.id}
                  message={message}
                  principal={principal.username}
                />
              ) : (
                <StatusInfo key={message.timestamp} message={message} />
              )
            )}
          </div>
        )}
      </div>
      <MessageInput onSubmit={onSendMessage} diabled={!connected || !joined} />
    </div>
  );
}
