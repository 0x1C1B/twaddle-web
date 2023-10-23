import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import useTwaddleChat from '../hooks/useTwaddleChat';
import StackTemplate from '../components/templates/StackTemplate';
import Link from '../components/atoms/Link';
import authSlice from '../store/slices/auth';

import LogoTextDark from '../assets/images/logo-text-dark.png';

/**
 * Application's logout page component.
 *
 * @return {JSX.Element} Application's logout page component
 */
export default function Logout() {
  const dispatch = useDispatch();

  const {disconnect} = useTwaddleChat();

  useEffect(() => {
    document.title = 'Twaddle Web | Logout';
  }, []);

  useEffect(() => {
    dispatch(authSlice.actions.clearAuthentication());
    disconnect();
  }, [dispatch]);

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md p-8 space-y-6">
          <img className="mx-auto h-10 md:h-12 lg:h-8 w-auto" src={LogoTextDark} alt="Logo" />
          <div className="flex items-center space-x-4 py-4">
            <hr className="w-full border-slate-300" />
            <div className="rounded-full border-4 border-green-200 p-4">
              <FontAwesomeIcon icon={faCheck} className="block h-10 w-10 text-green-600" aria-hidden="true" />
            </div>
            <hr className="w-full border-slate-300" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold">You have been logged out.</h1>
          <div className="text-center">Thank you</div>
        </div>
        <div className="text-center">
          <Link className="!text-sm !text-gray-800 !dark:text-white" to="/login">
            Log in again?
          </Link>
        </div>
      </div>
    </StackTemplate>
  );
}
