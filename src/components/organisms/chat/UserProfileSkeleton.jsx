import React from 'react';
import PropTypes from 'prop-types';

/**
 * Skeleton for a user profile.
 *
 * @return {JSX.Element} The user profile skeleton component
 */
export default function UserProfileSkeleton({error}) {
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
        <div>
          <div className="text-sm font-semibold text-gray-600">Status</div>
          <div className="rounded bg-slate-200 w-1/2 h-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600">Location</div>
          <div className="rounded bg-slate-200 w-1/2 h-4" />
        </div>
      </div>
    </div>
  );
}

UserProfileSkeleton.propTypes = {
  error: PropTypes.any,
};
