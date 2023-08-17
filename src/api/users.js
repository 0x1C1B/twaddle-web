import api from './index';

export const createUser = (data) => {
  return api.post('/users', data);
};

export const updateCurrentUser = (data) => {
  return api.patch('/user/me', data);
};

export const getCurrentUser = () => {
  return api.get('/user/me');
};

export const deleteCurrentUser = () => {
  return api.delete(`/user/me`);
};

export const sendPasswordResetMail = (email) => {
  return api.get(`/user/reset-password?email=${email}`);
};

export const resetPassword = (data) => {
  return api.post('/user/reset-password', data);
};

export const sendUserVerificationMail = (email) => {
  return api.get(`/user/verify-user?email=${email}`);
};

export const verifyUser = (data) => {
  return api.post('/user/verify-user', data);
};

export const getUserAvatar = (id) => {
  return api.get(`/users/${id}/avatar`, {responseType: 'blob'});
};

export const getCurrentUserAvatar = () => {
  return api.get(`/user/me/avatar`, {responseType: 'blob'});
};

export const deleteCurrentUserAvatar = () => {
  return api.delete(`/user/me/avatar`);
};

export const updateCurrentUserAvatar = (data) => {
  return api.post(`/user/me/avatar`, data);
};

export const getUserByUsername = (username) => {
  return api.get(`/users/by-username/${username}`);
};

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};
