import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import Button from '../../atoms/Button';

/**
 * Default header component for the chat list.
 *
 * @return {JSX.Element} The header component
 */
export default function ChatListDefaultHeader({onShowCreation}) {
  return (
    <div className="flex p-4 py-3 justify-between items-center h-16 border-b border-slate-300">
      <h2 className="text-xl font-semibold">Chats</h2>
      <div>
        <Button
          onClick={() => onShowCreation()}
          className={
            'flex items-center justify-center focus:!outline-none !border-0 ' + '!bg-slate-100 disabled:brightness-100'
          }
        >
          <FontAwesomeIcon className="h-4 w-4 text-slate-800 lg:h-5 lg:w-5" icon={faUserPlus} />
        </Button>
      </div>
    </div>
  );
}

ChatListDefaultHeader.propTypes = {
  onShowCreation: PropTypes.func.isRequired,
};
