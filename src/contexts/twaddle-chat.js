import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
  useReducer,
} from "react";
import io from "socket.io-client";

/**
 * @typedef {object} MessageDTO
 * @property {string} id
 * @property {string} content
 * @property {string} username
 * @property {string} room
 * @property {string} timestamp
 */

/**
 * @typedef {object} TwaddleChatContextProperties
 * @property {boolean} connecting
 * @property {boolean} connected
 * @property {boolean} joining
 * @property {boolean} joined
 * @property {string|undefined} error
 * @property {[string]} messages
 * @property {[string]} users
 * @property {(uri: string, ticket: string) => void} connect
 * @property {() => void} disconnect
 * @property {(room: string) => void} join
 * @property {() => void} leave
 * @property {(content: string, type: string) => void} send
 */

const TwaddleChatContext = React.createContext(null);

export function TwaddleChatProvider({ children }) {
  const socketRef = useRef(null);

  const [uri, setURI] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [room, setRoom] = useState(null);

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  const [state, dispatch] = useReducer(
    (currentState, action) => {
      switch (action.type) {
        case "SET_MESSAGES": {
          return {
            ...currentState,
            messages: action.messages,
          };
        }
        case "ADD_MESSAGE": {
          return {
            ...currentState,
            messages: [...currentState.messages, action.message],
          };
        }
        case "CLEAR_MESSAGES": {
          return {
            ...currentState,
            messages: [],
          };
        }
        case "SET_USERS": {
          return {
            ...currentState,
            users: action.users,
          };
        }
        case "ADD_USER": {
          return {
            ...currentState,
            users: [...currentState.users, action.user],
          };
        }
        case "REMOVE_USER": {
          return {
            ...currentState,
            users: currentState.users.filter((user) => user === action.user),
          };
        }
        case "CLEAR_USERS": {
          return {
            ...currentState,
            users: [],
          };
        }
        default: {
          return currentState;
        }
      }
    },
    { messages: [], users: [] }
  );

  useEffect(() => {
    if (uri && ticket) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      socketRef.current = io(uri, {
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

      socketRef.current.on("twaddle/room:joined", () => {
        setJoining(false);
        setJoined(true);
      });

      socketRef.current.on("twaddle/room:left", () => {
        setJoined(false);
        setRoom(null);
        dispatch({ type: "CLEAR_MESSAGES" });
        dispatch({ type: "CLEAR_USERS" });
      });

      socketRef.current.on("twaddle/room:message", (message) => {
        dispatch({ type: "ADD_MESSAGE", message });
      });

      socketRef.current.on("twaddle/room:user-list", ({ users: newUsers }) => {
        dispatch({ type: "SET_USERS", users: newUsers });
      });

      socketRef.current.on("twaddle/room:user-joined", ({ user: newUser }) => {
        dispatch({ type: "ADD_USER", user: newUser });
      });

      socketRef.current.on("twaddle/room:user-left", ({ user: oldUser }) => {
        dispatch({ type: "REMOVE_USER", user: oldUser });
      });

      setConnected(false);
      setError(null);
      setConnecting(true);
      dispatch({ type: "CLEAR_MESSAGES" });
      dispatch({ type: "CLEAR_USERS" });

      socketRef.current.connect();
      return true;
    }

    return false;
  }, [uri, ticket]);

  useEffect(() => {
    if (room) {
      setJoining(true);
      socketRef.current.emit("twaddle/room:join", { id: room });
      return true;
    }

    return false;
  }, [room]);

  // eslint-disable-next-line no-underscore-dangle
  const _leave = useCallback(() => {
    if (joined) {
      socketRef.current.emit("twaddle/room:leave");
      return true;
    }

    return false;
  }, [joined]);

  // eslint-disable-next-line no-underscore-dangle
  const _disconnect = useCallback(() => {
    if (connected) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      return true;
    }

    return false;
  }, [connected]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const connect = (newURI, newTicket) => {
    setURI(newURI);
    setTicket(newTicket);
  };

  const disconnect = () => {
    _disconnect();
  };

  const join = (newRoom) => {
    setRoom(newRoom);
  };

  const leave = () => {
    _leave();
  };

  const send = (content, type = "text/plain") => {
    socketRef.current.emit("twaddle/room:send", { content, type });
  };

  return (
    <TwaddleChatContext.Provider
      value={{
        connected,
        connecting,
        joining,
        joined,
        error,
        messages: state.messages,
        users: state.users,
        connect,
        disconnect,
        join,
        leave,
        send,
      }}
    >
      {children}
    </TwaddleChatContext.Provider>
  );
}

/**
 * Access the twaddle socket context.
 *
 * @returns {TwaddleChatContextProperties|null} Returns the context properties
 */
export const useTwaddleChat = () => {
  const context = useContext(TwaddleChatContext);

  if (!context) {
    throw new Error(
      "useSocket() may be used only in the context of a <SocketProvider> component."
    );
  }

  return context;
};
