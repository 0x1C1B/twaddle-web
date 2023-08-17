import React, {useEffect} from 'react';
import StackTemplate from '../components/templates/StackTemplate';
import Chat from '../components/organisms/chat/Chat';

/**
 * The landing page of the application.
 *
 * @return {JSX.Element} Application's landing page component
 */
export default function Home() {
  useEffect(() => {
    document.title = 'Twaddle Web | Home';
  }, []);

  return (
    <StackTemplate>
      <Chat />
    </StackTemplate>
  );
}
