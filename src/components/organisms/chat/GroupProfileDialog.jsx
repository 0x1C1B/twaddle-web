import React, {Fragment, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';
import GroupProfile from './GroupProfile';
import GroupProfileSkeleton from './GroupProfileSkeleton';
import {getGroupChatById} from '../../../api/chats';

/**
 * Dialog for viewing a group's profile.
 *
 * @return {JSX.Element} The dialog component
 */
export default function GroupProfileDialog({onClose, isOpen, chatId}) {
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroup = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const groupRes = await getGroupChatById(id);
      setGroup(groupRes.data);
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
    if (fetchGroup) {
      fetchGroup(chatId);
    }
  }, [fetchGroup, chatId]);

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
                'flex flex-col space-y-4'
              }
            >
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                  Group Profile
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faX} className="block h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grow overflow-y-auto">
                {loading && <GroupProfileSkeleton error={error} />}
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
                          <span className="text-sm">There seems to be an error loading the group profile.</span>
                        </div>
                      </div>
                      <GroupProfileSkeleton error={error} />
                    </>
                  ) : (
                    <GroupProfile group={group} onNewMember={() => fetchGroup(chatId)} />
                  ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

GroupProfileDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  chatId: PropTypes.string.isRequired,
};
