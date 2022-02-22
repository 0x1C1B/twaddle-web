import React, { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import io, { Socket } from "socket.io-client";

const SocketContext = React.createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const initInstance = (uri, options) => {
    const socket = io(uri, options);

    socketRef.current = socket;
    return socket;
  };

  const getInstance = () => socketRef.current;

  return (
    <SocketContext.Provider value={{ initInstance, getInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Hook for accessing the socket instance from other components.
 *
 * @returns {{initInstance: (uri: string, options: any) => Socket, getInstance: () => Socket | null }}
 */
export const useSocket = () => {
  const context = React.useContext(SocketContext);

  if (!context) {
    throw new Error(
      "You should not use 'useSocket()' outside a '<SocketProvider>'"
    );
  }

  return context;
};
