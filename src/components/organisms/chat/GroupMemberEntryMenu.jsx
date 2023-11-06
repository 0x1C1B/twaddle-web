import React, {Fragment, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Menu, Transition} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import {usePopper} from 'react-popper';
import {
  removeParticipantFromGroupChat,
  appointParticipantOfGroupChatAsAdmin,
  removeParticipantOfGroupChatAsAdmin,
} from '../../../api/chats';

/**
 * Group member menu component.
 *
 * @return {JSX.Element} The group member menu component
 */
export default function GroupMemberEntryMenu({group, user, onChange}) {
  const [popupButtonElement, setPopupButtonElement] = useState();
  const [popupDialogElement, setPopupDialogElement] = useState();
  const {styles, attributes} = usePopper(popupButtonElement, popupDialogElement, {
    placement: 'top-end',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['left', 'bottom-end', 'top-start', 'bottom-start', 'right'],
        },
      },
    ],
  });

  const onAppointAdmin = useCallback(async () => {
    try {
      await appointParticipantOfGroupChatAsAdmin(group.id, user.id);
      onChange();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }
    }
  }, []);

  const onRemoveAdminStatus = useCallback(async () => {
    try {
      await removeParticipantOfGroupChatAsAdmin(group.id, user.id);
      onChange();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }
    }
  }, []);

  const onRemoveFromGroup = useCallback(async () => {
    try {
      await removeParticipantFromGroupChat(group.id, user.id);
      onChange();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }
    }
  }, [group, user, onChange]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button ref={setPopupButtonElement} className="!text-xs flex justify-center items-center space-x-1">
        <FontAwesomeIcon icon={faEllipsisVertical} className="block h-5 w-5 text-slate-800" aria-hidden="true" />
      </Menu.Button>
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
              {user.isAdmin && (
                <Menu.Item>
                  {({active}) => (
                    <button
                      className={`${
                        active ? 'bg-slate-200' : 'bg-white'
                      } w-full text-left text-sm rounded p-2 text-slate-800`}
                      onClick={onRemoveAdminStatus}
                    >
                      Remove admin status
                    </button>
                  )}
                </Menu.Item>
              )}
              {!user.isAdmin && (
                <Menu.Item>
                  {({active}) => (
                    <button
                      className={`${
                        active ? 'bg-slate-200' : 'bg-white'
                      } w-full text-left text-sm rounded p-2 text-slate-800`}
                      onClick={onAppointAdmin}
                    >
                      Appoint to Administrator
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({active}) => (
                  <button
                    className={`${
                      active ? 'bg-slate-200' : 'bg-white'
                    } w-full text-left text-sm rounded p-2 text-slate-800`}
                    onClick={onRemoveFromGroup}
                  >
                    Remove from group
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

GroupMemberEntryMenu.propTypes = {
  user: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
