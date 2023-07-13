import React, {useEffect} from 'react';
import StackTemplate from '../components/templates/StackTemplate';

/**
 * The settings page of the application.
 *
 * @return {JSX.Element} Application's settings page component
 */
export default function Settings() {
  useEffect(() => {
    document.title = 'Twaddle Web | Settings';
  }, []);

  return <StackTemplate />;
}
