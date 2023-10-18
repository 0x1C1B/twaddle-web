import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from '../UserAvatar';

/**
 * Visualizes a user profile.
 *
 * @return {JSX.Element} The user profile component
 */
export default function UserProfile({user}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="bg-slate-200 text-slate-800 border border-slate-400 w-fit rounded-full">
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
