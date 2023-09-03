import React, {useRef, useState, useEffect, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import {useQueue} from '@uidotdev/usehooks';

const TwaddleChatContext = React.createContext(null);

/**
 * Provider for the twaddle chat socket instance.
 *
 * @return {JSX.Element} The twaddle chat provider
 */
export function TwaddleChatProvider({children}) {
  const socketRef = useRef(null);

  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.removeAllListeners();
      socketRef.current = null;
    }

    setConnecting(false);
    setConnected(false);
  }, []);

  const connect = useCallback(
    (newUri, newTicket) => {
      disconnect();

      socketRef.current = io(newUri, {
        autoConnect: false,
        reconnection: false,
        transports: ['websocket'],
        query: {
          ticket: newTicket,
        },
      });

      socketRef.current.on('connect', async () => {
        setConnecting(false);
        setConnected(true);

        console.debug(`Socket connection established.`);
      });

      socketRef.current.on('disconnect', async (reason) => {
        setConnecting(false);
        setConnected(false);

        if (reason === 'ping timeout' || reason === 'transport error') {
          setError('The connection was unexpectedly lost.');
          console.error('The connection was unexpectedly lost.', reason);
        } else {
          console.debug('Socket connection disconnected.');
        }
      });

      socketRef.current.on('connect_error', (err) => {
        setConnecting(false);
        setConnected(false);

        setError('An unexpected error occurred, please retry.');
        console.error('Socket connection error occurred.', err);
      });

      socketRef.current.on('error', (err) => {
        setError('An unexpected error occurred, please retry.');
        console.error('Socket domain error occurred.', err);
      });

      setError(null);
      setConnected(false);
      setConnecting(true);

      console.debug(`Establishing socket connection to '${newUri}'...`);

      socketRef.current.connect();
    },
    [disconnect],
  );

  const sendMessage = useCallback((message) => {
    if (socketRef.current) {
      socketRef.current.emit('message', message);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <TwaddleChatContext.Provider
      value={{
        connected,
        connecting,
        error,
        socket: socketRef.current,
        connect,
        disconnect,
        sendMessage,
      }}
    >
      {children}
    </TwaddleChatContext.Provider>
  );
}

TwaddleChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Access the twaddle chat socket context.
 *
 * @return {object} Returns the context properties
 */
export const useTwaddleChat = () => {
  const context = useContext(TwaddleChatContext);

  if (!context) {
    throw new Error('useTwaddleChat() may be used only in the context of a <TwaddleChatProvider> component.');
  }

  return context;
};

/**
 * Hook to listen to twaddle chat events.
 *
 * @param {string} event The event to listen to
 * @param {Function} listener The listener to add
 */
export const useTwaddleEvent = (event, listener) => {
  const events = useQueue();

  const {socket} = useTwaddleChat();

  useEffect(() => {
    if (socket) {
      socket.on(event, events.add);
    }
  }, [socket]);

  useEffect(() => {
    if (events.size > 0) {
      listener(events.first);
      events.remove();
    }
  }, [events.size]);
};
