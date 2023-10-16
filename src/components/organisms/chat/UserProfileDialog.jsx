import React, {Fragment, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {Dialog, Transition} from '@headlessui/react';
import UserAvatar from '../UserAvatar';
import {getUserById} from '../../../api/users';

/**
 * Visualizes a user profile.
 *
 * @return {JSX.Element} The user profile component
 */
function UserProfile({user}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
          <div className="h-32 w-32 rounded-full overflow-hidden">
            <UserAvatar userId={user.id} />
          </div>
        </div>
        <div className="text-center overflow-hidden">
          {user.displayName && (
            <>
              <div className="text-lg font-semibold text-gray-800 truncate">{user.displayName}</div>
              <div className="text-sm font-semibold text-gray-600 truncate">@{user.username}</div>
            </>
          )}
        </div>
      </div>
      <hr className="border-b border-slate-300" />
      <div className="space-y-2">
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-gray-600">Status</div>
          <div className="font-semibold text-gray-800">{user?.status || '-'}</div>
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-semibold text-gray-600 truncate">Location</div>
          <div className="font-semibold text-gray-800 truncate">{user?.location || '-'}</div>
        </div>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  user: PropTypes.object.isRequired,
};

/**
 * Skeleton for a user profile.
 *
 * @return {JSX.Element} The user profile skeleton component
 */
function UserProfileSkeleton({error}) {
  return (
    <div className={`space-y-6 ${!error && 'animate-pulse'}`}>
      <div className="flex flex-col items-center space-y-2">
        <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
          <div className="w-32 h-32 rounded-full overflow-hidden" />
        </div>
        <div className="flex flex-col items-center overflow-hidden space-y-1">
          <div className="rounded bg-slate-200 w-32 h-4" />
          <div className="rounded bg-slate-200 w-24 h-4" />
        </div>
      </div>
      <hr className="border-b border-slate-300" />
      <div className="space-y-2">
        <div>
          <div className="text-sm font-semibold text-gray-600">Status</div>
          <div className="rounded bg-slate-200 w-1/2 h-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600">Location</div>
          <div className="rounded bg-slate-200 w-1/2 h-4" />
        </div>
      </div>
    </div>
  );
}

UserProfileSkeleton.propTypes = {
  error: PropTypes.any,
};

/**
 * Dialog for viewing a user's profile.
 *
 * @return {JSX.Element} The dialog component
 */
export default function UserProfileDialog({onClose, isOpen, userId}) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const userRes = await getUserById(id);
      setUser(userRes.data);
    } catch (err) {
      if (err.response && err.response.data?.code === 'InvalidTokenError') {
        navigate('/login');
      } else {
        setError('An unexpected error occurred, please retry!');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const onCloseModal = () => {
    if (!loading) {
      onClose();
    }
  };

  useEffect(() => {
    if (fetchUser) {
      fetchUser(userId);
    }
  }, [fetchUser, userId]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onCloseModal} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="h-screen overflow-hidden p-4 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-800 opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={
                'inline-block max-h-[calc(100%-2rem)] h-fit w-full max-w-md p-4 overflow-hidden text-left ' +
                'transition-all transform bg-white shadow-xl rounded-2xl bg-white text-gray-800 ' +
                'flex flex-col h-full space-y-4'
              }
            >
              <div className="flex justify-between items-center space-x-2">
                <Dialog.Title as="h3" className="text-lg font-semibold leading-6 overflow-hidden">
                  User Profile
                </Dialog.Title>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onCloseModal}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faX} className="block h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grow overflow-y-auto">
                {loading && <UserProfileSkeleton error={error} />}
                {!loading &&
                  (error ? (
                    <>
                      <div className="flex justify-center mb-4">
                        <div
                          className={
                            'text-red-500 flex justify-center items-center space-x-2 bg-slate-200 p-2 w-fit rounded'
                          }
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                          <span className="text-sm">There seems to be an error loading the user profile.</span>
                        </div>
                      </div>
                      <UserProfileSkeleton error={error} />
                    </>
                  ) : (
                    <UserProfile user={user} />
                  ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

UserProfileDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
};
