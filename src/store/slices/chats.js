import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chats: [],
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action) => {
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };
    },
    setChats: (state, action) => {
      return {
        ...state,
        chats: action.payload,
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
  },
});

export default chatsSlice;
