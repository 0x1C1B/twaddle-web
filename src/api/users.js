// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import instance from "./instance";

/**
 * @typedef {object} UserDTO
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} role
 * @property {boolean} blocked
 */

/**
 * @typedef {object} UserPageDTO
 * @property {[UserDTO]} content
 * @property {{perPage: number, page: number, totalElements: number, totalPages: number}} info
 */

/**
 * Loads the meta information of all available user accounts.
 * The resource is loaded paged.
 *
 * @param {number} page Zero based index of the page to load
 * @param {string} filter Optional RSQL filter to filter the resource
 * @returns {Promise<AxiosResponse<UserPageDTO>>} Returns the API response
 */
export const fetchUsers = (page, filter) => {
  return instance.get("/users", {
    params: { page, filter },
  });
};

/**
 * Loads the information of a single user account based on its id.
 *
 * @param {string} username Unique username of the resource
 * @returns {Promise<AxiosResponse<UserDTO>>} Returns the API response
 */
export const fetchUser = (username) => {
  return instance.get(`/users/${username}`);
};

/**
 * Create a new user account.
 *
 * @param {{username: string, email: string, password: string}} data Fields of the new account to be created
 * @returns {Promise<AxiosResponse<UserDTO>>} Returns the API response
 */
export const createUser = (data) => {
  return instance.post("/users", data);
};

/**
 * Update an existing user acocunt by its identifier.
 *
 * @param {string} username Unique username of the resource
 * @param {{email: string|undefined, password: string|undefined, blocked: boolean|undefined, role: string|undefined}} data Fields of the account to be updated
 * @returns {Promise<AxiosResponse<UserDTO>>} Returns the API response
 */
export const updateUser = (username, data) => {
  return instance.patch(`/users/${username}`, data);
};

/**
 * Deletes an existing user account by its identifier.
 *
 * @param {string} username Unique username of the resource
 * @returns {Promise<AxiosResponse>} Returns the API response
 */
export const deleteUser = (username) => {
  return instance.delete(`/users/${username}`);
};
