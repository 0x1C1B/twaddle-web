import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';
import {Dialog, Transition} from '@headlessui/react';

/**
 * Dialog for updating the current user's avatar.
 *
 * @return {JSX.Element} The dialog component
 */
export default function UpdateCurrentUserAvatarDialog({onSubmit, onClose, isOpen}) {
  const [loading] = useState(false);

  const onCloseModal = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onCloseModal} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
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
                'inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle ' +
                'transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white text-gray-800'
              }
            >
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                  Update profile image
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

UpdateCurrentUserAvatarDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
