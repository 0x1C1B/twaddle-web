import React, {useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTwaddleChat} from '../contexts/TwaddleChatContext';
import StackTemplate from '../components/templates/StackTemplate';
import {generateTicket} from '../api/auth';

/**
 * The landing page of the application.
 *
 * @return {JSX.Element} Application's landing page component
 */
export default function Home() {
  const navigate = useNavigate();

  const {connect} = useTwaddleChat();

  const onConnect = useCallback(async () => {
    try {
      const ticketRes = await generateTicket();
      const {ticket} = ticketRes.data;

      await connect(process.env.REACT_APP_TWADDLE_WS_URI, ticket);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }

      throw err;
    }
  }, [navigate]);

  useEffect(() => {
    document.title = 'Twaddle Web | Home';
  }, []);

  useEffect(() => {
    onConnect();
  }, [onConnect]);

  return <StackTemplate />;
}
