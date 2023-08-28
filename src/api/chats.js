import api from './index';

export const createChat = (data) => {
  return api.post('/chats', data);
};

export const getCurrentUserChats = () => {
  return api.get('/user/me/chats');
};

export const getChatById = (id) => {
  return api.get(`/chats/${id}`);
};

export const getMessagesOfChat = (id, page) => {
  return api.get(`/chats/${id}/messages`, {params: { page },});
};
