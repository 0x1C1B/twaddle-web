import api from './index';

export const createPrivateChat = (data) => {
  return api.post('/chats/private', data);
};

export const getCurrentUserPrivateChats = () => {
  return api.get('/user/me/chats/private');
};

export const getPrivateChatById = (id) => {
  return api.get(`/chats/private/${id}`);
};

export const getMessagesOfPrivateChat = (id, page, perPage, timestampOffset) => {
  return api.get(`/chats/private/${id}/messages`, {params: {page, perPage, timestampOffset}});
};

export const createGroupChat = (data) => {
  return api.post('/chats/group', data);
};

export const getCurrentUserGroupChats = () => {
  return api.get('/user/me/chats/group');
};

export const getGroupChatById = (id) => {
  return api.get(`/chats/group/${id}`);
};

export const getMessagesOfGroupChat = (id, page, perPage, timestampOffset) => {
  return api.get(`/chats/group/${id}/messages`, {params: {page, perPage, timestampOffset}});
};

/**
 * Creates a chat.
 *
 * @param {object} data The chat data
 * @param {"private"|"group"} type The chat type
 * @return {Promise<any>} The request promise
 */
export const createChat = (data, type) => {
  if (type === 'private') {
    return createPrivateChat(data);
  } else if (type === 'group') {
    return createGroupChat(data);
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
};

/**
 * Fetch the current user chats.
 *
 * @param {"private"|"group"} type The chat type
 * @return {Promise<any>} The request promise
 */
export const getCurrentUserChats = (type) => {
  if (type === 'private') {
    return getCurrentUserPrivateChats();
  } else if (type === 'group') {
    return getCurrentUserGroupChats();
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
};

/**
 * Fetch the current user chats.
 *
 * @param {string} id The chat id
 * @param {"private"|"group"} type The chat type
 * @return {Promise<any>} The request promise
 */
export const getChatById = (id, type) => {
  if (type === 'private') {
    return getPrivateChatById(id);
  } else if (type === 'group') {
    return getGroupChatById(id);
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
};

/**
 * Get the messages of a chat.
 *
 * @param {string} id The chat id
 * @param {"private"|"group"} type The chat type
 * @param {number} page The page number
 * @param {number} perPage The number of messages per page
 * @param {number} timestampOffset The timestamp offset
 * @return {Promise<any>} The request promise
 */
export const getMessagesOfChat = (id, type, page, perPage, timestampOffset) => {
  if (type === 'private') {
    return getMessagesOfPrivateChat(id, page, perPage, timestampOffset);
  } else if (type === 'group') {
    return getMessagesOfGroupChat(id, page, perPage, timestampOffset);
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
};
