import React, {Fragment, useState, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {usePopper} from 'react-popper';
import {Menu, Transition} from '@headlessui/react';
import Button from '../../atoms/Button';
import {deleteGroupChatAvatar, updateGroupChatAvatar} from '../../../api/chats';

/**
 * A menu component for updating a group chat's avatar.
 *
 * @return {JSX.Element} The menu component
 */
export default function UpdateGroupChatAvatarMenu({chatId, onChange}) {
  const navigate = useNavigate();

  const fileInputRef = useRef();

  const [popupButtonElement, setPopupButtonElement] = useState();
  const [popupDialogElement, setPopupDialogElement] = useState();
  const {styles, attributes} = usePopper(popupButtonElement, popupDialogElement, {
    placement: 'bottom-end',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom-start', 'top-end', 'top-start', 'left', 'right'],
        },
      },
    ],
  });

  const onUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];

      try {
        if (file) {
          const data = new FormData();
          data.append('file', file);

          await updateGroupChatAvatar(chatId, data);
          onChange();
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        }

        if (!err.response && !err.request) {
          console.error(err);
        }
      }
    },
    [chatId, navigate],
  );

  const onDelete = useCallback(async () => {
    try {
      await deleteGroupChatAvatar(chatId);
      onChange();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }

      if (!err.response && !err.request) {
        console.error(err);
      }
    }
  }, [chatId, navigate]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        as={Button}
        ref={setPopupButtonElement}
        className="!text-xs flex justify-center items-center space-x-1"
      >
        <FontAwesomeIcon icon={faPen} className="block h-3 w-3 text-slate-800" aria-hidden="true" />
        <span>Edit</span>
      </Menu.Button>
      <input ref={fileInputRef} type="file" className="hidden" onChange={onUpload} />
      <div
        className="w-56 mt-1 max-w-xs sm:max-w-sm z-50"
        ref={setPopupDialogElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="divide-y divide-gray-100 shadow-md border rounded-md bg-white text-gray-800">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({active}) => (
                  <button
                    className={`${
                      active ? 'bg-slate-200' : 'bg-white'
                    } w-full text-left text-sm rounded p-2 text-slate-800`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload an image
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({active}) => (
                  <button
                    className={`${
                      active ? 'bg-slate-200' : 'bg-white'
                    } w-full text-left text-sm rounded p-2 text-slate-800`}
                    onClick={onDelete}
                  >
                    Remove image
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
}

UpdateGroupChatAvatarMenu.propTypes = {
  chatId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
