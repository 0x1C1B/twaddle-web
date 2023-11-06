import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import UserAvatar from '../../organisms/UserAvatar';
import GroupMemberEntryMenu from '../../organisms/chat/GroupMemberEntryMenu';

/**
 * A component that displays a single group member in the list.
 *
 * @return {JSX.Element} The list entry component
 */
export default function GroupMemberEntry({user, group, onChange}) {
  const principal = useSelector((state) => state.auth.principal);

  return (
    <div className="rounded p-2 hover:bg-slate-200">
      <div className="flex justify-between items-center space-x-2">
        <div className="flex space-x-4 items-center overflow-hidden">
          <div className="bg-slate-200 text-slate-800 border border-slate-400 w-fit rounded-full">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <UserAvatar userId={user.id} />
            </div>
          </div>
          <div className="space-y-1 overflow-hidden">
            {user.id === principal.id ? (
              <span className="block truncate font-semibold">You</span>
            ) : (
              <span className="block truncate font-semibold">{user.displayName || user.username}</span>
            )}
          </div>
        </div>
        <div className={`flex items-center justify-center space-x-2 ${user.id === principal.id && 'pr-7'}`}>
          {user.isAdmin && (
            <div className="w-fit bg-green-200 rounded-md p-1 flex justify-center items-center">
              <div className="truncate font-semibold text-green-800 text-xs">Administrator</div>
            </div>
          )}
          {user.id !== principal.id &&
            group.participants.find((participant) => participant.id === principal.id)?.isAdmin && (
              <GroupMemberEntryMenu group={group} user={user} onChange={onChange} />
            )}
        </div>
      </div>
    </div>
  );
}

GroupMemberEntry.propTypes = {
  user: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
