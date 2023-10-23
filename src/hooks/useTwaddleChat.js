import {useContext} from 'react';
import {TwaddleChatContext} from '../contexts/TwaddleChatContext';

/**
 * Access the twaddle chat socket context.
 *
 * @return {object} Returns the context properties
 */
export default function useTwaddleChat() {
  const context = useContext(TwaddleChatContext);

  if (!context) {
    throw new Error('useTwaddleChat() may be used only in the context of a <TwaddleChatProvider> component.');
  }

  return context;
}
