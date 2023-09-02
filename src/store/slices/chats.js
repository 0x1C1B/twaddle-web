import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timestampOffset: new Date().toISOString(),
  chats: [],
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action) => {
      const newChat = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === newChat.id);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...state.chats.slice(0, chatIndex),
            {
              ...state.chats[chatIndex],
              participants: newChat.participants,
            },
            ...state.chats.slice(chatIndex + 1),
          ],
        };
      }

      return {
        ...state,
        chats: [...state.chats, newChat],
      };
    },
    setChats: (state, action) => {
      const newChats = action.payload;

      const updatedChats = newChats.map((newChat) => {
        const chatIndex = state.chats.findIndex((chat) => chat.id === newChat.id);

        if (chatIndex !== -1) {
          return {
            ...state.chats[chatIndex],
            participants: newChat.participants,
          };
        }

        return newChat;
      });

      return {
        ...state,
        chats: updatedChats,
      };
    },
    removeChat: (state, action) => {
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.id !== action.payload),
      };
    },
    addLiveMessage: (state, action) => {
      const {chatId, message} = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...state.chats.slice(0, chatIndex),
            {
              ...state.chats[chatIndex],
              liveMessages: [...state.chats[chatIndex].liveMessages, message],
            },
            ...state.chats.slice(chatIndex + 1),
          ],
        };
      }

      return state;
    },
    setStoredMessages: (state, action) => {
      const {chatId, page, messages} = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...state.chats.slice(0, chatIndex),
            {
              ...state.chats[chatIndex],
              storedMessages: {...state.chats[chatIndex].storedMessages, [page]: messages},
            },
            ...state.chats.slice(chatIndex + 1),
          ],
        };
      }

      return state;
    },
    setStoredMessagesLoaded: (state, action) => {
      const {chatId} = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...state.chats.slice(0, chatIndex),
            {
              ...state.chats[chatIndex],
              storedMessagesLoaded: true,
            },
            ...state.chats.slice(chatIndex + 1),
          ],
        };
      }

      return state;
    },
  },
});

export default chatsSlice;
