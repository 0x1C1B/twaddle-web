import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  PaperAirplaneIcon,
  StatusOnlineIcon,
  StatusOfflineIcon,
} from "@heroicons/react/solid";
import StackTemplate from "../components/templates/StackTemplate";
import Avatar from "../components/atoms/Avatar";
import Button from "../components/atoms/Button";
import TextArea from "../components/atoms/TextArea";
import authSlice from "../store/slices/auth";
import { useSocket } from "../contexts/socket";

const schema = yup.object().shape({
  message: yup.string().required("Is required"),
});

const useMessages = () => {
  const [messages, setMessages] = useState([]);

  const setMessage = (message) => setMessages([...messages, message]);

  return { setMessage, setMessages, messages };
};

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [room, setRoom] = useState(null);
  const [ticket, setTicket] = useState(null);
  const { messages, setMessage } = useMessages();

  const [apiError, setApiError] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const [socketError, setSocketError] = useState(false);
  const [socketLoading, setSocketLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const { initInstance, getInstance } = useSocket();

  const onSubmit = (values, { resetForm }) => {
    const socket = getInstance();

    if (socket) {
      socket.emit("twaddle/room:send", { message: values.message });
      resetForm();
    }
  };

  useEffect(() => {
    document.title = `Twaddle Web | ${room?.name || "Room"}`;
  }, [room]);

  useEffect(() => {
    const fetchRoom = (id) => {
      setApiLoading(true);
      setApiError(null);

      return axios
        .get(`/rooms/${id}`, {
          baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRoom(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.data?.code === "InvalidTokenError") {
            dispatch(authSlice.actions.logout());
            navigate("/login");
          } else if (
            err.response &&
            err.response.data?.code === "NotFoundError"
          ) {
            navigate("/404");
          } else {
            setApiError("An unexpected error occurred, please retry!");
          }
        })
        .finally(() => setApiLoading(false));
    };

    const fetchTicket = () => {
      setApiLoading(true);
      setApiError(null);

      return axios
        .post("/tickets", null, {
          baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setTicket(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.data?.code === "InvalidTokenError") {
            dispatch(authSlice.actions.logout());
            navigate("/login");
          } else {
            setApiError("An unexpected error occurred, please retry!");
          }
        })
        .finally(() => setApiLoading(false));
    };

    if (roomId && token) {
      fetchRoom(roomId).then(fetchTicket);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, token]);

  useEffect(() => {
    const initSocket = async (reqTicket) => {
      const currentSocket = getInstance();

      const newSocket =
        currentSocket && currentSocket.connected
          ? currentSocket
          : initInstance(process.env.REACT_APP_TWADDLE_WS_URI, {
              autoConnect: false,
              reconnection: false,
              query: {
                ticket: reqTicket,
              },
            });

      newSocket.on("connect", async () => {
        setSocketLoading(false);
        newSocket.emit("twaddle/room:join", { id: roomId });
      });

      newSocket.on("disconnect", async (reason) => {
        setSocketLoading(false);
        setSocketConnected(false);

        if (reason === "ping timeout" || reason === "transport error") {
          setSocketError("The connection was unexpectedly lost.");
        }
      });

      newSocket.on("connect_error", (err) => {
        // eslint-disable-next-line no-console
        console.error("Socket connection error occurred", err);
        setSocketError("An unexpected error occurred, please retry!");
        setSocketLoading(false);
      });

      newSocket.on("twaddle/error", (err) => {
        // eslint-disable-next-line no-console
        console.error("Socket business error occurred", err);

        if (err.code === "AlreadyConnectedError") {
          setSocketError(
            "A session for the current user is already open. Only one session can be opened per user."
          );
        } else {
          setSocketError("An unexpected error occurred, please retry!");
        }
      });

      newSocket.on("twaddle/room:joined", () => {
        setSocketConnected(true);
      });

      newSocket.on("twaddle/room:left", () => {
        setSocketConnected(false);
      });

      newSocket.connect();
    };

    if (roomId && ticket) {
      initSocket(ticket.ticket);
    }
  }, [initInstance, getInstance, roomId, ticket]);

  useEffect(() => {
    if (socketConnected) {
      const socket = getInstance();

      socket.on("twaddle/room:message", (message) => {
        setMessage({ ...message, type: "message" });
      });

      socket.on("twaddle/room:user-joined", ({ user: joinedUser }) => {
        setMessage({
          content: `'${joinedUser}' joined the room`,
          timestamp: new Date().toISOString(),
          type: "status",
        });
      });

      socket.on("twaddle/room:user-left", ({ user: leftUser }) => {
        setMessage({
          content: `'${leftUser}' left the room`,
          timestamp: new Date().toISOString(),
          type: "status",
        });
      });
    }
  }, [setMessage, getInstance, socketConnected]);

  useEffect(() => {
    return () => {
      const socket = getInstance();
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO Implement infinity scroll pagination for chat messages
  // TODO Implement sticky scrolling to bottom for the chat box

  return (
    <StackTemplate>
      <div className="h-full bg-white dark:bg-gray-600">
        <div className="xl:container mx-auto px-2 sm:px-6 lg:px-8 py-4 h-full">
          <div className="flex flex-col space-y-4 h-full">
            {apiLoading && (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
              </div>
            )}
            {!apiLoading && apiError && (
              <p className="text-center text-red-500">{apiError}</p>
            )}
            {!apiLoading && !apiError && (
              <div className="flex flex-col grow bg-gray-100 dark:bg-gray-500 rounded-md">
                <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 dark:text-white rounded-t-md flex justify-between">
                  <nav className="rounded-md w-full">
                    <ol className="list-reset flex">
                      <li>
                        <Link
                          className="text-amber-500 hover:text-amber-400"
                          to="/rooms"
                        >
                          Rooms
                        </Link>
                      </li>
                      <li>
                        <span className="text-gray-500 mx-2">/</span>
                      </li>
                      <li className="text-gray-500">{room?.name || "Room"}</li>
                    </ol>
                  </nav>
                  {socketConnected && !socketLoading && !socketError && (
                    <StatusOnlineIcon
                      className="h-6 w-6 text-green-500"
                      aria-hidden="true"
                    />
                  )}
                  {!socketConnected && !socketLoading && (
                    <StatusOfflineIcon
                      className="h-6 w-6 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="grow h-0 overflow-y-scroll px-3 py-2">
                  {socketLoading && (
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-b-2 border-lime-500 rounded-full animate-spin" />
                    </div>
                  )}
                  {!socketLoading && socketError && (
                    <p className="text-center text-red-500">{socketError}</p>
                  )}
                  {!socketLoading && !socketError && (
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
                                {message.user}
                              </div>
                              <div className="w-full break-words">
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
                  onSubmit={onSubmit}
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
                          disabled={apiLoading || socketLoading || apiError}
                          className="rounded-tl-none rounded-r-none resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="border-l-0 rounded-l-none rounded-t-none"
                        disabled={
                          !(props.isValid && props.dirty) ||
                          apiLoading ||
                          socketLoading ||
                          apiError
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
            )}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
