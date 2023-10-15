import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that displays a skeleton for a group member entry.
 *
 * @return {JSX.Element} The skeleton component
 */
export default function GroupMemberEntrySkeleton({error}) {
  return (
    <div className="rounded p-2">
      <div className={`flex space-x-4 ${!error && 'animate-pulse'} items-center overflow-hidden`}>
        <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
          <div className="h-8 w-8 rounded-full overflow-hidden" />
        </div>
        <div className="space-y-1 overflow-hidden grow">
          <div className="rounded bg-slate-200 w-2/3 h-4" />
        </div>
      </div>
    </div>
  );
}

GroupMemberEntrySkeleton.propTypes = {
  error: PropTypes.any,
};
