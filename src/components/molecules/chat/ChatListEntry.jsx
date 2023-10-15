import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import UserAvatar from '../../organisms/UserAvatar';
import Avatar from '../../atoms/Avatar';

/**
 * A component that displays a single chat in the list.
 *
 * @return {JSX.Element} The list entry component
 */
export default function ChatListEntry({chat, selected, onChatSelect}) {
  const principal = useSelector((state) => state.auth.principal);

  return (
    <div
      className={`hover:bg-slate-200 rounded p-2 cursor-pointer ${selected ? 'bg-slate-300 hover:bg-slate-300' : ''}`}
      onClick={() => onChatSelect(chat.id, chat.type)}
    >
      <div className="flex space-x-4 items-center overflow-hidden">
        {chat.type === 'private' ? (
          <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <UserAvatar userId={chat.participants.filter((participant) => participant.id !== principal.id)[0].id} />
            </div>
          </div>
        ) : (
          <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <Avatar value={chat.name} />
            </div>
          </div>
        )}
        <div className="space-y-1 overflow-hidden">
          <span className="block truncate font-semibold">{chat.name}</span>
        </div>
      </div>
    </div>
  );
}

ChatListEntry.propTypes = {
  chat: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onChatSelect: PropTypes.func.isRequired,
};
