import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timestampOffset: new Date().toISOString(),
  chats: [],
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    /**
     * Adds a new chat to the state.
     *
     * @param {*} state The current state
     * @param {{type: ("private"|"group"), chat: object}} action The action object
     * @return {*} The altered state
     */
    addChat: (state, action) => {
      const {type, chat: newChat} = action.payload;

      let chats;
      let remainingChats;

      if (type === 'private') {
        chats = state.chats.filter((chat) => chat.type === 'private');
        remainingChats = state.chats.filter((chat) => chat.type === 'group');
      } else {
        chats = state.chats.filter((chat) => chat.type === 'group');
        remainingChats = state.chats.filter((chat) => chat.type === 'private');
      }

      const chatIndex = chats.findIndex((chat) => chat.id === newChat.id);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...chats.slice(0, chatIndex),
            {
              ...chats[chatIndex],
              participants: newChat.participants,
            },
            ...chats.slice(chatIndex + 1),
            ...remainingChats,
          ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
        };
      }

      return {
        ...state,
        chats: [
          ...chats,
          {liveMessages: [], storedMessages: {}, storedMessagesLoaded: false, type, ...newChat},
          ...remainingChats,
        ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
      };
    },
    /**
     * Sets the chats in the state. This is used when the user logs and all available chats are loaded from the
     * database.
     *
     * @param {*} state The current state
     * @param {{type: ("private"|"group"), chats: [object]}} action The action object
     * @return {*} The altered state
     */
    setChats: (state, action) => {
      const {type, chats: newChats} = action.payload;

      let chats;
      let remainingChats;

      if (type === 'private') {
        chats = state.chats.filter((chat) => chat.type === 'private');
        remainingChats = state.chats.filter((chat) => chat.type === 'group');
      } else {
        chats = state.chats.filter((chat) => chat.type === 'group');
        remainingChats = state.chats.filter((chat) => chat.type === 'private');
      }

      const updatedChats = newChats.map((newChat) => {
        const chatIndex = chats.findIndex((chat) => chat.id === newChat.id);

        if (chatIndex !== -1) {
          return {
            ...chats[chatIndex],
            name: newChat.name,
            participants: newChat.participants,
          };
        }

        return {liveMessages: [], storedMessages: {}, storedMessagesLoaded: false, type, ...newChat};
      });

      return {
        ...state,
        chats: [...updatedChats, ...remainingChats].sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        ),
      };
    },
    /**
     * Removes a private chat from the state.
     *
     * @param {*} state The current state
     * @param {{type: ("private"|"group"), chatId: string}} action The action object
     * @return {*} The altered state
     */
    removeChat: (state, action) => {
      const {type, chatId} = action.payload;

      let chats;

      if (type === 'private') {
        chats = state.chats.filter((chat) => chat.type === 'private');
      } else {
        chats = state.chats.filter((chat) => chat.type === 'group');
      }

      return {
        ...state,
        chats: chats.filter((chat) => chat.id !== chatId),
      };
    },
    /**
     * Add a new live message. Live messages are messages that have been written in the current session. Hence
     * since the user came online.
     *
     * @param {*} state The current state
     * @param {{type: ("private"|"group"), chatId: string, message: object}} action The action object
     * @return {*} The altered state
     */
    addLiveMessage: (state, action) => {
      const {type, chatId, message} = action.payload;

      let chats;
      let remainingChats;

      if (type === 'private') {
        chats = state.chats.filter((chat) => chat.type === 'private');
        remainingChats = state.chats.filter((chat) => chat.type === 'group');
      } else {
        chats = state.chats.filter((chat) => chat.type === 'group');
        remainingChats = state.chats.filter((chat) => chat.type === 'private');
      }

      const chatIndex = chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...chats.slice(0, chatIndex),
            {
              ...chats[chatIndex],
              liveMessages: [...chats[chatIndex].liveMessages, message],
            },
            ...chats.slice(chatIndex + 1),
            ...remainingChats,
          ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
        };
      }

      return state;
    },
    /**
     * Sets the stored messages for a chat. Stored messages are messages that have been written in former sessions
     * and are stored in the database. They are loaded when the user scrolls up in the chat.
     *
     * @param {*} state The current state
     * @param {{type: ("private"|"group"), chatId: string, page: number, messages: [object]}} action The action object
     * @return {*} The altered state
     */
    setStoredMessages: (state, action) => {
      const {type, chatId, page, messages} = action.payload;

      let chats;
      let remainingChats;

      if (type === 'private') {
        chats = state.chats.filter((chat) => chat.type === 'private');
        remainingChats = state.chats.filter((chat) => chat.type === 'group');
      } else {
        chats = state.chats.filter((chat) => chat.type === 'group');
        remainingChats = state.chats.filter((chat) => chat.type === 'private');
      }

      const chatIndex = chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...chats.slice(0, chatIndex),
            {
              ...chats[chatIndex],
              storedMessages: {...chats[chatIndex].storedMessages, [page]: messages},
            },
            ...chats.slice(chatIndex + 1),
            ...remainingChats,
          ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
        };
      }

      return state;
    },
    /**
     * Sets a flag to indicate that all stored messages have been loaded for a chat.
     *
     * @param {*} state The current state
     * @param {{type: ("private"|"group"), chatId: string}} action The action object
     * @return {*} The altered state
     */
    setStoredMessagesLoaded: (state, action) => {
      const {type, chatId} = action.payload;

      let chats;
      let remainingChats;

      if (type === 'private') {
        chats = state.chats.filter((chat) => chat.type === 'private');
        remainingChats = state.chats.filter((chat) => chat.type === 'group');
      } else {
        chats = state.chats.filter((chat) => chat.type === 'group');
        remainingChats = state.chats.filter((chat) => chat.type === 'private');
      }

      const chatIndex = chats.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        return {
          ...state,
          chats: [
            ...chats.slice(0, chatIndex),
            {
              ...chats[chatIndex],
              storedMessagesLoaded: true,
            },
            ...chats.slice(chatIndex + 1),
            ...remainingChats,
          ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
        };
      }

      return state;
    },
  },
});

export default chatsSlice;
