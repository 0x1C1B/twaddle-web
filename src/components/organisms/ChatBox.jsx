import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PaperAirplaneIcon,
  StatusOnlineIcon,
  StatusOfflineIcon,
} from "@heroicons/react/solid";
import io from "socket.io-client";
import { Formik } from "formik";
import * as yup from "yup";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";

const schema = yup.object().shape({
  message: yup.string().required("Is required"),
});

export default function ChatBox({ room, ticket }) {
  const socketRef = useRef(null);

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const user = useSelector((state) => state.auth.user);

  const onSendMessage = (values, { resetForm }) => {
    socketRef.current.emit("twaddle/room:send", { message: values.message });
    resetForm();
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
        setError("An unexpected error occurred, please retry!");
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
        setMessages([...messages, { ...message, type: "message" }]);
      });

      socketRef.current.on(
        "twaddle/room:user-joined",
        ({ user: joinedUser }) => {
          setMessages([
            ...messages,
            {
              content: `'${joinedUser}' joined the room`,
              timestamp: new Date().toISOString(),
              type: "status",
            },
          ]);
        }
      );

      socketRef.current.on("twaddle/room:user-left", ({ user: leftUser }) => {
        setMessages([
          ...messages,
          {
            content: `'${leftUser}' left the room`,
            timestamp: new Date().toISOString(),
            type: "status",
          },
        ]);
      });
    }
  }, [joined, messages]);

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
      <div className="grow h-0 overflow-hidden overflow-y-scroll px-3 py-4">
        {(connecting || joining) && !error && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {connected && joined && (
          <div className="space-y-2 flex flex-col">
            {messages.map((message) =>
              message.type === "message" ? (
                <div
                  key={message.timestamp}
                  className={`w-fit min-w-[15rem] max-w-[100%] sm:max-w-[70%] flex items-end ${
                    message.username === user.username && "self-end"
                  }`}
                >
                  <div
                    className={`grow p-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-white rounded-md flex flex-col space-y-1 ${
                      message.username === user.username
                        ? "bg-amber-500 dark:bg-amber-500 text-white rounded-br-none order-first"
                        : "rounded-bl-none"
                    }`}
                  >
                    <div className="text-sm font-bold truncate">
                      {message.username}
                    </div>
                    <div className="w-full break-all whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="w-fit text-xs self-end">
                      {new Date(message.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`h-8 aspect-square rounded-md ml-2 ${
                      message.username !== user.username &&
                      "order-first mr-2 ml-0"
                    }`}
                  >
                    <Avatar value={message.username} />
                  </div>
                </div>
              ) : (
                <div
                  key={message.timestamp}
                  className="p-2 text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-white w-fit rounded-md self-center"
                >
                  {message.content}
                </div>
              )
            )}
          </div>
        )}
      </div>
      <Formik
        initialValues={{ message: "" }}
        onSubmit={onSendMessage}
        validationSchema={schema}
      >
        {(props) => (
          <form
            className="flex w-full shrink"
            onSubmit={props.handleSubmit}
            noValidate
          >
            <div className="w-full">
              <TextArea
                autoFocus
                rows="1"
                name="message"
                placeholder="Message"
                value={props.values.message}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                disabled={connecting || joining || error}
                className="rounded-none resize-none"
              />
            </div>
            <Button
              type="submit"
              className="border-l-0 rounded-none"
              disabled={
                !(props.isValid && props.dirty) ||
                connecting ||
                joining ||
                error
              }
            >
              <PaperAirplaneIcon
                className="h-6 w-6 rotate-90"
                aria-hidden="true"
              />
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}
