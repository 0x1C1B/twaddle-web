import React, {useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import StackTemplate from '../components/templates/StackTemplate';
import Link from '../components/atoms/Link';

import LogoTextDark from '../assets/images/logo-text-dark.png';

/**
 * Application's not found page component.
 *
 * @return {JSX.Element} Application's not found page component
 */
export default function Logout() {
  useEffect(() => {
    document.title = 'Twaddle Web | Not Found';
  }, []);

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md p-8 space-y-6">
          <img className="mx-auto h-10 md:h-12 lg:h-8 w-auto" src={LogoTextDark} alt="Logo" />
          <div className="flex items-center space-x-4 py-4">
            <hr className="w-full border-slate-300" />
            <div className="rounded-full border-4 border-red-200 p-4">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="block h-10 w-10 text-red-500"
                aria-hidden="true"
              />
            </div>
            <hr className="w-full border-slate-300" />
          </div>
          <h1 className="mt-4 text-center text-2xl font-bold">404 - Page not found</h1>
          <div className="text-center">The page you are looking for does not exist.</div>
        </div>
        <div className="text-center">
          <Link className="!text-sm !text-gray-800 !dark:text-white" to="/home">
            Back to home?
          </Link>
        </div>
      </div>
    </StackTemplate>
  );
}
