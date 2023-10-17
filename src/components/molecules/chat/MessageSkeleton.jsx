import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading skeleton for a message.
 *
 * @return {JSX.Element} The skeleton component
 */
export default function MessageSkeleton({error, isOwner}) {
  return (
    <div className={`w-full flex justify-begin ${!error && 'animate-pulse'} ${isOwner && 'justify-end'}`}>
      <div className="w-fit min-w-[15rem] max-w-[100%] sm:max-w-[70%] flex">
        <div
          className={
            'grow p-2 bg-sky-200 text-slate-800 rounded-md flex space-y-4 ' +
            `flex-col space-y-1 ${isOwner && 'bg-slate-500 text-white order-first'}`
          }
        >
          <div className="rounded bg-slate-200 w-2/3 h-4" />
          <div className="space-y-1">
            <div className="rounded bg-slate-200 w-1/2 h-3" />
            <div className="rounded bg-slate-200 w-4/5 h-3" />
            <div className="rounded bg-slate-200 w-2/3 h-3" />
          </div>
          <div className="w-fit text-xs self-end">
            <div className="rounded bg-slate-200 w-32 h-2" />
          </div>
        </div>
        <div
          className={
            'shrink-0 h-8 w-8 bg-slate-200 text-slate-800 border border-slate-400 p-1' +
            ` rounded-full ${!isOwner ? 'order-first mr-2' : 'ml-2'}`
          }
        >
          <div className="w-full h-full rounded-full overflow-hidden" />
        </div>
      </div>
    </div>
  );
}

MessageSkeleton.propTypes = {
  error: PropTypes.any,
  isOwner: PropTypes.bool.isRequired,
};
