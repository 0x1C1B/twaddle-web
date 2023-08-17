import React, {useState, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useTwaddleChat} from '../../../contexts/TwaddleChatContext';
import ChatList from './ChatList';
import MessageBox from './MessageBox';
import {generateTicket} from '../../../api/auth';
import {getUserById} from '../../../api/users';
import chatsSlice from '../../../store/slices/chats';

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

  const chats = useSelector((state) => state.chats.chats);
  const principal = useSelector((state) => state.auth.principal);

  const onConnect = useCallback(async () => {
    try {
      const ticketRes = await generateTicket();
      const {ticket} = ticketRes.data;

      await twaddleChat.connect(process.env.REACT_APP_TWADDLE_WS_URI, ticket);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      }

      throw err;
    }
  }, [navigate]);

  const onMessage = useCallback(
    async (newMessage) => {
      try {
        if (!newMessage) return;

        let chat;

        if (newMessage.from === principal.id) {
          chat = chats.find((chat) => chat.id === newMessage.to);
        } else {
          chat = chats.find((chat) => chat.id === newMessage.from);
        }

        if (!chat) {
          const userRes = await getUserById(newMessage.from);

          dispatch(
            chatsSlice.actions.addChat({
              id: userRes.data.id,
              name: userRes.data.displayName || userRes.data.username,
              user: userRes.data,
              messages: [newMessage],
            }),
          );
        } else {
          dispatch(chatsSlice.actions.addMessage({chatId: chat.id, message: newMessage}));
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        }

        throw err;
      }
    },
    [chats],
  );

  useEffect(() => {
    if (!twaddleChat.connected && !twaddleChat.connecting) {
      onConnect();
    }
  }, [onConnect, twaddleChat.connected, twaddleChat.connecting]);

  useEffect(() => {
    if (twaddleChat.messageCount > 0) {
      onMessage(twaddleChat.receive());
    }
  }, [twaddleChat.messageCount]);

  return (
    <div className="h-full">
      <div className="hidden lg:flex h-full">
        <div className="w-1/3 xl:w-1/4 h-full">
          <ChatList selectedChat={selectedChat} onChatSelect={(chatId) => setSelectedChat(chatId)} />
        </div>
        <div className="w-2/3 xl:w-3/4 h-full">
          {selectedChat ? (
            <MessageBox selectedChat={selectedChat} onBackButtonClick={() => setSelectedChat(null)} />
          ) : (
            <div className="flex justify-center items-center w-full bg-gray-200 h-full">
              <p>Select a chat.</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex lg:hidden h-full">
        {selectedChat ? (
          <MessageBox selectedChat={selectedChat} onBackButtonClick={() => setSelectedChat(null)} />
        ) : (
          <ChatList selectedChat={selectedChat} onChatSelect={(chatId) => setSelectedChat(chatId)} />
        )}
      </div>
    </div>
  );
}
