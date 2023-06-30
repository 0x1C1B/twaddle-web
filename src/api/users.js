import api from './index';

export const createUser = (data) => {
  return api.post('/users', data);
};
