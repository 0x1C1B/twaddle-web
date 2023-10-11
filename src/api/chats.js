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
