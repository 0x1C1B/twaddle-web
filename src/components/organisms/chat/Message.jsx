import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import UserAvatar from '../UserAvatar';
import CurrentUserAvatar from '../CurrentUserAvatar';

/**
 * Component for displaying a text message.
 *
 * @return {JSX.Element} The text message component
 */
export default function Message({chat, message}) {
  const principal = useSelector((state) => state.auth.principal);

  return (
    <div className={`w-full flex justify-begin ${message.from === principal.id && 'justify-end'}`}>
      <div className="w-fit min-w-[15rem] max-w-[100%] sm:max-w-[70%] flex">
        <div
          className={
            'grow p-2 bg-sky-200 text-slate-800 rounded-md flex ' +
            `flex-col space-y-1 ${message.from === principal.id && 'bg-slate-500 text-white order-first'}`
          }
        >
          <div className="text-sm font-bold truncate">
            {message.from === principal.id ? principal.displayName || principal.username : chat.name}
          </div>
          <div className="w-full break-all whitespace-pre-wrap">{message.content}</div>
          <div className="w-fit text-xs self-end">{new Date(message.timestamp).toLocaleString()}</div>
        </div>
        <div
          className={
            'shrink-0 h-8 w-8 bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit' +
            ` rounded-full ml-2 ${message.from !== principal.id && 'order-first mr-2 ml-0'}`
          }
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            {message.from === principal.id ? <CurrentUserAvatar /> : <UserAvatar userId={message.from} />}
          </div>
        </div>
      </div>
    </div>
  );
}

Message.propTypes = {
  chat: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};
