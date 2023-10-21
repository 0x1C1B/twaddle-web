import api from './index';

/**
 * Creates a private chat.
 *
 * @param {object} data The chat data
 * @return {Promise<any>} The request promise
 */
export function createPrivateChat(data) {
  return api.post('/chats/private', data);
}

/**
 * Fetch the current user's private chats.
 *
 * @return {Promise<any>} The request promise
 */
export function getCurrentUserPrivateChats() {
  return api.get('/user/me/chats/private');
}

/**
 * Fetches a private chat by id.
 *
 * @param {string} id The chat id
 * @return {Promise<any>} The request promise
 */
export function getPrivateChatById(id) {
  return api.get(`/chats/private/${id}`);
}

/**
 * Creates a group chat.
 *
 * @param {object} data The chat data
 * @return {Promise<any>} The request promise
 */
export function createGroupChat(data) {
  return api.post('/chats/group', data);
}

/**
 * Updates a group chat.
 *
 * @param {string} id The chat id
 * @param {object} data The chat data
 * @return {Promise<any>} The request promise
 */
export function updateGroupChateById(id, data) {
  return api.patch(`/chats/group/${id}`, data);
}

/**
 * Fetch the current user's group chats.
 *
 * @return {Promise<any>} The request promise
 */
export function getCurrentUserGroupChats() {
  return api.get('/user/me/chats/group');
}

/**
 * Fetches a group chat by id.
 *
 * @param {string} id The chat id
 * @return {Promise<any>} The request promise
 */
export function getGroupChatById(id) {
  return api.get(`/chats/group/${id}`);
}

/**
 * Adds a participant to a group chat.
 *
 * @param {string} id The chat id
 * @param {object} data The participant data
 * @return {Promise<any>} The request promise
 */
export function addParticipantToGroupChat(id, data) {
  return api.post(`/chats/group/${id}/participants`, data);
}

/**
 * Creates a chat.
 *
 * @param {object} data The chat data
 * @param {"private"|"group"} type The chat type
 * @return {Promise<any>} The request promise
 */
export function createChat(data, type) {
  if (type === 'private') {
    return createPrivateChat(data);
  } else if (type === 'group') {
    return createGroupChat(data);
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
}

/**
 * Fetch the current user chats.
 *
 * @param {"private"|"group"} type The chat type
 * @return {Promise<any>} The request promise
 */
export function getCurrentUserChats(type) {
  if (type === 'private') {
    return getCurrentUserPrivateChats();
  } else if (type === 'group') {
    return getCurrentUserGroupChats();
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
}

/**
 * Fetch the current user chats.
 *
 * @param {string} id The chat id
 * @param {"private"|"group"} type The chat type
 * @return {Promise<any>} The request promise
 */
export function getChatById(id, type) {
  if (type === 'private') {
    return getPrivateChatById(id);
  } else if (type === 'group') {
    return getGroupChatById(id);
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
}

/**
 * Fetchs the avatar of a group chat.
 *
 * @param {string} id The chat id
 * @return {Promise<any>} The request promise
 */
export function getGroupChatAvatar(id) {
  return api.get(`/chats/group/${id}/avatar`, {responseType: 'blob'});
}

/**
 * Updates a group chat's avatar.
 *
 * @param {string} id The chat id
 * @param {object} data The avatar data
 * @return {Promise<any>} The request promise
 */
export function updateGroupChatAvatar(id, data) {
  return api.post(`/chats/group/${id}/avatar`, data);
}

/**
 * Deletes a group chat's avatar.
 *
 * @param {string} id The chat id
 * @return {Promise<any>} The request promise
 */
export function deleteGroupChatAvatar(id) {
  return api.delete(`/chats/group/${id}/avatar`);
}
