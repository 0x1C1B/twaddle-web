import React from 'react';
import PropTypes from 'prop-types';
import GroupMemberEntrySkeleton from '../../molecules/chat/GroupMemberEntrySkeleton';

/**
 * Skeleton for a group profile.
 *
 * @return {JSX.Element} The group profile skeleton component
 */
export default function GroupProfileSkeleton({error}) {
  return (
    <div className={`space-y-6 ${!error && 'animate-pulse'}`}>
      <div className="flex flex-col items-center space-y-2">
        <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
          <div className="w-32 h-32 rounded-full overflow-hidden" />
        </div>
        <div className="flex flex-col items-center overflow-hidden space-y-1">
          <div className="rounded bg-slate-200 w-32 h-4" />
          <div className="rounded bg-slate-200 w-24 h-4" />
        </div>
      </div>
      <hr className="border-b border-slate-300" />
      <div className="space-y-2">
        <div className="px-2 text-sm flex items-center space-x-1">
          <div className="rounded bg-slate-200 w-5 h-4" />
          <span>Member(s)</span>
        </div>
        <ul className="space-y-2">
          {Array.from(Array(3).keys()).map((value) => (
            <li key={value}>
              <GroupMemberEntrySkeleton error={error} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

GroupProfileSkeleton.propTypes = {
  error: PropTypes.any,
};
