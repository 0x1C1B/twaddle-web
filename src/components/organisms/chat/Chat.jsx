import React, {useState, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useTwaddleChat, useTwaddleEvent} from '../../../contexts/TwaddleChatContext';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import {generateTicket} from '../../../api/auth';
import {getChatById} from '../../../api/chats';
import chatsSlice from '../../../store/slices/chats';
import usersSlice from '../../../store/slices/users';

/**
 * A chat component that displays all available chats and allows the user to
 * create new chats.
 *
 * @return {JSX.Element} The chat component
 */
export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const twaddleChat = useTwaddleChat();

  const [selectedChat, setSelectedChat] = useState(null);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const onConnect = useCallback(async () => {
    try {
      const ticketRes = await generateTicket();
      const {ticket} = ticketRes.data;

      await twaddleChat.connect(process.env.REACT_APP_TWADDLE_WS_URI, ticket);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }
    }
  }, [navigate]);

  const onPrivateMessage = useCallback(
    async (newMessage) => {
      try {
        if (!newMessage) return;

        const chat = chats.find((chat) => chat.id === newMessage.to);

        if (!chat) {
          const chatRes = await getChatById(newMessage.to, 'private');

          dispatch(
            chatsSlice.actions.addChat({
              type: 'private',
              chat: {
                ...chatRes.data,
                name:
                  chatRes.data.participants.filter((participant) => participant.id !== principal.id)[0].displayName ||
                  chatRes.data.participants.filter((participant) => participant.id !== principal.id)[0].username,
              },
            }),
          );
        } else {
          dispatch(chatsSlice.actions.addLiveMessage({chatId: chat.id, type: 'private', message: newMessage}));
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        }
      }
    },
    [chats],
  );

  const onGroupMessage = useCallback(
    async (newMessage) => {
      try {
        if (!newMessage) return;

        const chat = chats.find((chat) => chat.id === newMessage.to);

        if (!chat) {
          const chatRes = await getChatById(newMessage.to, 'group');

          dispatch(
            chatsSlice.actions.addChat({
              type: 'group',
              chat: chatRes.data,
            }),
          );
        } else {
          dispatch(chatsSlice.actions.addLiveMessage({chatId: chat.id, type: 'group', message: newMessage}));
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        }
      }
    },
    [chats],
  );

  useEffect(() => {
    if (!twaddleChat.connected && !twaddleChat.connecting) {
      onConnect();
    }
  }, [onConnect, twaddleChat.connected, twaddleChat.connecting]);

  useTwaddleEvent('message/private', onPrivateMessage);
  useTwaddleEvent('message/group', onGroupMessage);
  useTwaddleEvent('user/online', (userId) => dispatch(usersSlice.actions.markUserOnline(userId)));
  useTwaddleEvent('user/offline', (userId) => dispatch(usersSlice.actions.markUserOffline(userId)));

  return (
    <div className="h-full flex flex-col">
      <div className="hidden lg:flex grow">
        <div className="w-1/3 xl:w-1/4 h-full">
          <ChatList selectedChat={selectedChat} onChatSelect={(id, type) => setSelectedChat({id, type})} />
        </div>
        <div className="w-2/3 xl:w-3/4 h-full">
          {selectedChat ? (
            <ChatBox selectedChat={selectedChat} onBackButtonClick={() => setSelectedChat(null)} />
          ) : (
            <div className="flex justify-center items-center w-full bg-gray-200 h-full">
              <p>Select a chat.</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex lg:hidden h-full grow">
        {selectedChat ? (
          <ChatBox selectedChat={selectedChat} onBackButtonClick={() => setSelectedChat(null)} />
        ) : (
          <ChatList selectedChat={selectedChat} onChatSelect={(id, type) => setSelectedChat({id, type})} />
        )}
      </div>
    </div>
  );
}
