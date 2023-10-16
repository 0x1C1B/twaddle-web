import React, {Fragment, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';
import {Dialog, Transition} from '@headlessui/react';
import Button from '../../atoms/Button';
import {deleteCurrentUser} from '../../../api/users';

/**
 * Dialog for confirming the deletion of the current user.
 *
 * @return {JSX.Element} The dialog component
 */
export default function DeleteCurrentUserDialog({onSubmit, onClose, isOpen}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitModal = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteCurrentUser();
      onSubmit();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      } else if (err.response && err.response.status === 409) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred, please retry.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, onSubmit]);

  const onCloseModal = () => {
    if (!loading) {
      onClose();
    }
  };

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
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                  Delete your account
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onCloseModal}
                  disabled={loading}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faX} className="block h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="grow overflow-y-auto space-y-6">
                {error && <p className="text-center text-red-500">{error}</p>}
                <p>
                  Are you sure you want to delete your account? This action cannot be undone. Clicking &quot;Delete
                  account&quot; will immediately delete your account and log you out.
                </p>
                <Button onClick={onSubmitModal} disabled={loading} className="w-full !text-red-500">
                  {!loading && <span>Delete account</span>}
                  {loading && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

DeleteCurrentUserDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
