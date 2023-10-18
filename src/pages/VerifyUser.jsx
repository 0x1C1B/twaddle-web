import React, {useEffect, useState, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTriangleExclamation, faHourglassHalf} from '@fortawesome/free-solid-svg-icons';
import StackTemplate from '../components/templates/StackTemplate';
import Link from '../components/atoms/Link';
import {verifyUser} from '../api/users';

import LogoTextDark from '../assets/images/logo-text-dark.png';

/**
 * Application's user verification page component.
 *
 * @return {JSX.Element} Application's user verification page component
 */
export default function VerifyUser() {
  const {verificationToken} = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onLoad = useCallback(async (_verificationToken) => {
    setSuccess(false);
    setError(null);
    setLoading(true);

    try {
      await verifyUser({
        verificationToken: _verificationToken,
      });

      setSuccess(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('It seems the verification link has expired.');
      } else {
        setError('An unexpected error occurred, please retry.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Twaddle Web | Verify User';
  }, []);

  useEffect(() => {
    onLoad(verificationToken);
  }, [verificationToken, onLoad]);

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md p-8 space-y-6">
          <img className="mx-auto h-10 md:h-12 lg:h-8 w-auto" src={LogoTextDark} alt="Logo" />
          <div className="flex items-center space-x-4 py-4">
            <hr className="w-full border-slate-300" />
            {!loading && success && (
              <div className="rounded-full border-4 border-green-200 p-4">
                <FontAwesomeIcon icon={faCheck} className="block h-10 w-10 text-green-600" aria-hidden="true" />
              </div>
            )}
            {!loading && error && (
              <div className="rounded-full border-4 border-red-200 p-4">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="block h-10 w-10 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
            {loading && (
              <div className="rounded-full border-4 border-sky-200 p-4">
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  className="animate-pulse block h-10 w-10 text-sky-500"
                  aria-hidden="true"
                />
              </div>
            )}
            <hr className="w-full border-slate-300" />
          </div>
          {!loading && success && (
            <div className="space-y-6">
              <h1 className="mt-4 text-center text-2xl font-bold">Your account has been verified.</h1>
              <div className="text-center">Thank you</div>
            </div>
          )}
          {!loading && error && (
            <div className="space-y-6">
              <h1 className="mt-4 text-center text-2xl font-bold">Something went wrong.</h1>
              <div className="text-center text-red-500">{error}</div>
            </div>
          )}
          {loading && (
            <div className="space-y-6">
              <h1 className="mt-4 text-center text-2xl font-bold">Verifying your account...</h1>
              <div className="text-center">Please wait</div>
            </div>
          )}
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
