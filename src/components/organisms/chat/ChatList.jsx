import React, {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import ChatListDefaultHeader from './ChatListDefaultHeader';
import ChatListCreationHeader from './ChatListCreationHeader';
import ChatListEntry from '../../molecules/chat/ChatListEntry';
import ChatListEntrySkeleton from '../../molecules/chat/ChatListEntrySkeleton';
import {getCurrentUserChats} from '../../../api/chats';
import chatsSlice from '../../../store/slices/chats';

/**
 * A component that displays all available chats in a list.
 *
 * @return {JSX.Element} The list component
 */
export default function ChatList({selectedChat, onChatSelect}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showCreation, setShowCreation] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const getChats = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const privateChatsRes = await getCurrentUserChats('private');
      const groupChatsRes = await getCurrentUserChats('group');

      dispatch(
        chatsSlice.actions.setChats({
          type: 'private',
          chats: privateChatsRes.data.map((chat) => ({
            ...chat,
            name:
              chat.participants.filter((participant) => participant.id !== principal.id)[0].displayName ||
              chat.participants.filter((participant) => participant.id !== principal.id)[0].username,
          })),
        }),
      );

      dispatch(
        chatsSlice.actions.setChats({
          type: 'group',
          chats: groupChatsRes.data,
        }),
      );
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      } else {
        setError('An unexpected error occurred, please retry.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <div className="w-full h-full bg-gray-100 space-y-4 border-r border-slate-300 flex flex-col">
      {!showCreation && <ChatListDefaultHeader onShowCreation={() => setShowCreation(true)} />}
      {showCreation && (
        <ChatListCreationHeader
          onNewChat={(id, type) => {
            onChatSelect(id, type);
            setShowCreation(false);
          }}
          onReturn={() => setShowCreation(false)}
        />
      )}
      <div className="grow p-2 space-y-4 flex flex-col">
        {loading && (
          <ul className="space-y-2 grow h-0 overflow-hidden overflow-y-auto px-2">
            {Array.from(Array(5).keys()).map((value) => (
              <li key={value}>
                <ChatListEntrySkeleton />
              </li>
            ))}
          </ul>
        )}
        {!loading &&
          (error ? (
            <>
              <div className="flex justify-center">
                <div
                  className={'text-red-500 flex justify-center items-center space-x-2 bg-slate-200 p-2 w-fit rounded'}
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span className="text-sm">There seems to be an error loading the chats.</span>
                </div>
              </div>
              <ul className="space-y-2 grow h-0 overflow-hidden overflow-y-auto px-2">
                {Array.from(Array(5).keys()).map((value) => (
                  <li key={value}>
                    <ChatListEntrySkeleton error={error} />
                  </li>
                ))}
              </ul>
            </>
          ) : chats.length === 0 ? (
            <div className="text-center">
              <span>No conversations were found.</span>
            </div>
          ) : (
            <ul className="space-y-2 grow h-0 overflow-hidden overflow-y-auto px-2">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <ChatListEntry chat={chat} selected={selectedChat?.id === chat.id} onChatSelect={onChatSelect} />
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
}

ChatList.propTypes = {
  selectedChat: PropTypes.object,
  onChatSelect: PropTypes.func.isRequired,
};
