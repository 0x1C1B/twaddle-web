import api from './index';

export const createUser = (data) => {
  return api.post('/users', data);
};

export const getCurrentUser = () => {
  return api.get('/user');
};

export const sendPasswordResetMail = (email) => {
  return api.get(`/user/reset?email=${email}`);
};

export const resetPassword = (data) => {
  return api.post('/user/reset', data);
};
