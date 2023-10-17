import api from './index';

/**
 * Creates a user.
 *
 * @param {object} data The user data
 * @return {Promise<any>} The request promise
 */
export function createUser(data) {
  return api.post('/users', data);
}

/**
 * Updates the current user.
 *
 * @param {object} data The user data
 * @return {Promise<any>} The request promise
 */
export function updateCurrentUser(data) {
  return api.patch('/user/me', data);
}

/**
 * Fetchs the current user.
 *
 * @return {Promise<any>} The request promise
 */
export function getCurrentUser() {
  return api.get('/user/me');
}

/**
 * Deletes the current user.
 *
 * @return {Promise<any>} The request promise
 */
export function deleteCurrentUser() {
  return api.delete(`/user/me`);
}

/**
 * Requests a password reset email to be sent to the user.
 *
 * @param {string} email The user's email
 * @return {Promise<any>} The request promise
 */
export function sendPasswordResetMail(email) {
  return api.get(`/user/reset-password?email=${email}`);
}

/**
 * Resets a user's password. This is used when a user clicks on the password
 * reset link sent to their email.
 *
 * @param {object} data The password reset data
 * @return {Promise<any>} The request promise
 */
export function resetPassword(data) {
  return api.post('/user/reset-password', data);
}

/**
 * Requests a verification email to be sent to the user.
 *
 * @param {string} email The user's email
 * @return {Promise<any>} The request promise
 */
export function sendUserVerificationMail(email) {
  return api.get(`/user/verify-user?email=${email}`);
}

/**
 * Verifies a user. This is used when a user clicks on the verification link
 * sent to their email.
 *
 * @param {object} data The verification data
 * @return {Promise<any>} The request promise
 */
export function verifyUser(data) {
  return api.post('/user/verify-user', data);
}

/**
 * Fetchs the avatar of a user.
 *
 * @param {string} id The user id
 * @return {Promise<any>} The request promise
 */
export function getUserAvatar(id) {
  return api.get(`/users/${id}/avatar`, {responseType: 'blob'});
}

/**
 * Fetchs the current user's avatar.
 *
 * @return {Promise<any>} The request promise
 */
export function getCurrentUserAvatar() {
  return api.get(`/user/me/avatar`, {responseType: 'blob'});
}

/**
 * Deletes the current user's avatar.
 *
 * @return {Promise<any>} The request promise
 */
export function deleteCurrentUserAvatar() {
  return api.delete(`/user/me/avatar`);
}

/**
 * Updates the current user's avatar.
 *
 * @param {object} data The avatar data
 * @return {Promise<any>} The request promise
 */
export function updateCurrentUserAvatar(data) {
  return api.post(`/user/me/avatar`, data);
}

/**
 * Fetchs a user by username.
 *
 * @param {string} username The username
 * @return {Promise<any>} The request promise
 */
export function getUserByUsername(username) {
  return api.get(`/users/by-username/${username}`);
}

/**
 * Fetchs a user by id.
 *
 * @param {string} id The user id
 * @return {Promise<any>} The request promise
 */
export function getUserById(id) {
  return api.get(`/users/${id}`);
}

/**
 * Checks if a user is online.
 *
 * @param {string} id The user id
 * @return {Promise<any>} The request promise
 */
export function getStatusById(id) {
  return api.get(`/users/${id}/status`);
}
