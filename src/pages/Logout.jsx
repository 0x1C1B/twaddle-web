import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import StackTemplate from '../components/templates/StackTemplate';
import Link from '../components/atoms/Link';
import authSlice from '../store/slices/auth';

import Logo from '../assets/images/logo.png';

/**
 * Application's logout page component.
 *
 * @return {JSX.Element} Application's logout page component
 */
export default function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Twaddle Web | Logout';
  }, []);

  useEffect(() => {
    dispatch(authSlice.actions.clearAuthentication());
  }, [dispatch]);

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md p-8 space-y-6">
          <div>
            <img className="mx-auto h-10 md:h-12 lg:h-14 w-auto" src={Logo} alt="Logo" />
            <h1 className="mt-4 text-center lg:text-3xl text-2xl font-bold">Hope to see you soon.</h1>
          </div>
          <p>
            You have been logged out. To log in again navigate to the login page or click <Link to="/login">here</Link>.
          </p>
        </div>
      </div>
    </StackTemplate>
  );
}
