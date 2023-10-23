import {useEffect} from 'react';
import useTwaddleChat from './useTwaddleChat';
import {useQueue} from '@uidotdev/usehooks';

/**
 * Hook to listen to twaddle chat events.
 *
 * @param {string} event The event to listen to
 * @param {Function} listener The listener to add
 */
export default function useTwaddleEvent(event, listener) {
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
}
