import React from 'react';
import PropTypes from 'prop-types';
import {Tab} from '@headlessui/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faUser, faUsers} from '@fortawesome/free-solid-svg-icons';
import PrivatChatCreationForm from './PrivateChatCreationForm';
import GroupChatCreationForm from './GroupChatCreationForm';
import Button from '../../atoms/Button';

/**
 * Header component for the chat list that allows the user to create a new chat.
 *
 * @return {JSX.Element} The header component
 */
export default function ChatListCreationHeader({onNewChat, onReturn}) {
  return (
    <div className="border-b border-slate-300 px-2">
      <Tab.Group>
        <div className="flex py-3 justify-between items-center h-16 space-x-2 pr-2">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onReturn()}
              className={
                'flex items-center justify-center focus:!outline-none !border-0 ' +
                '!bg-slate-100 disabled:brightness-100'
              }
            >
              <FontAwesomeIcon className="h-4 w-4 text-slate-800 lg:h-5 lg:w-5" icon={faArrowLeft} />
            </Button>
            <h2 className="text-xl font-semibold">New Chat</h2>
          </div>
          <Tab.List className="flex w-fit space-x-1 rounded-xl bg-gray-200 p-1">
            <Tab
              className={({selected}) =>
                `flex justify-center items-center p-1 rounded-lg text-sm focus:outline-none ${
                  selected
                    ? 'bg-white shadow text-sky-500'
                    : 'text-slate-800 hover:bg-white/[0.12] hover:brightness-110'
                }`
              }
            >
              <FontAwesomeIcon className="h-4 w-4 text-slate-800 lg:h-5 lg:w-5" icon={faUser} />
            </Tab>
            <Tab
              className={({selected}) =>
                `flex justify-center items-center p-1 rounded-lg text-sm focus:outline-none ${
                  selected
                    ? 'bg-white shadow text-sky-500'
                    : 'text-slate-800 hover:bg-white/[0.12] hover:brightness-110'
                }`
              }
            >
              <FontAwesomeIcon className="h-4 w-4 text-slate-800 lg:h-5 lg:w-5" icon={faUsers} />
            </Tab>
          </Tab.List>
        </div>
        <div className="pb-3 space-y-2 p-2">
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <PrivatChatCreationForm onNewChat={(id) => onNewChat(id, 'private')} />
            </Tab.Panel>
            <Tab.Panel>
              <GroupChatCreationForm onNewChat={(id) => onNewChat(id, 'group')} />
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
}

ChatListCreationHeader.propTypes = {
  onNewChat: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};
