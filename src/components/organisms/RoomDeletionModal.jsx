import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import axios from "axios";
import Button from "../atoms/Button";
import authSlice from "../../store/slices/auth";

/**
 * @typedef {object} RoomDeletionModalProperties
 * @property {string} roomId
 * @property {JSX.Element=} children
 * @property {() => void} onSuccess
 */

/**
 * Constructs a room deletion modal component.
 *
 * @param {RoomDeletionModalProperties} properties The modal properties
 * @returns {JSX.Element} Returns the modal component
 */
export default function RoomDeletionModal({ roomId, onSuccess, children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const closeModal = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const openModal = () => {
    setOpen(true);
  };

  const onSubmit = () => {
    setLoading(true);
    setError(null);

    axios
      .delete(`/rooms/${roomId}`, {
        baseURL: process.env.REACT_APP_TWADDLE_REST_URI,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setOpen(false);
        onSuccess();
      })
      .catch((err) => {
        if (err.response && err.response.data?.code === "InvalidTokenError") {
          dispatch(authSlice.actions.logout());
          navigate("/login");
        } else {
          setError("An unexpected error occurred, please retry!");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {React.cloneElement(children, { onClick: openModal })}

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
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
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Delete room
                  </Dialog.Title>
                  <button
                    onClick={() => closeModal()}
                    disabled={loading}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {error && <p className="text-center text-red-500">{error}</p>}
                <div>
                  Are you sure you want to delete the chat room? All saved
                  messages and active sessions will be lost and it will not be
                  possible to restore the room. Continue?
                </div>
                <div className="flex justify-between">
                  <Button
                    onClick={onSubmit}
                    disabled={loading}
                    className="bg-green-500 focus:outline-green-500 w-32 flex justify-center"
                  >
                    {!loading && <span>Yes</span>}
                    {loading && (
                      <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                    )}
                  </Button>
                  <Button
                    onClick={closeModal}
                    disabled={loading}
                    className="bg-red-500 focus:outline-red-500 w-32"
                  >
                    No
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
