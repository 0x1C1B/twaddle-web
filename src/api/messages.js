import api from './index';

/**
 * Get the messages of a private chat.
 *
 * @param {string} id The chat id
 * @param {number} page The page number
 * @param {number} perPage The number of messages per page
 * @param {number} timestampOffset The timestamp offset
 * @return {Promise<any>} The request promise
 */
export function getMessagesOfPrivateChat(id, page, perPage, timestampOffset) {
  return api.get(`/chats/private/${id}/messages`, {params: {page, perPage, timestampOffset}});
}

/**
 * Get the messages of a group chat.
 *
 * @param {string} id The chat id
 * @param {number} page The page number
 * @param {number} perPage The number of messages per page
 * @param {number} timestampOffset The timestamp offset
 * @return {Promise<any>} The request promise
 */
export function getMessagesOfGroupChat(id, page, perPage, timestampOffset) {
  return api.get(`/chats/group/${id}/messages`, {params: {page, perPage, timestampOffset}});
}

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
export function getMessagesOfChat(id, type, page, perPage, timestampOffset) {
  if (type === 'private') {
    return getMessagesOfPrivateChat(id, page, perPage, timestampOffset);
  } else if (type === 'group') {
    return getMessagesOfGroupChat(id, page, perPage, timestampOffset);
  } else {
    throw new Error(`Invalid chat type: ${type}`);
  }
}
