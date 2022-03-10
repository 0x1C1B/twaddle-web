// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import instance from "./instance";

/**
 * @typedef {object} TokenDTO
 * @property {"Bearer"} type
 * @property {string} token
 * @property {string} subject
 * @property {string} expires
 */

/**
 * Generates an access token on the server side.
 *
 * @param {string} username Name of user to generate token for
 * @param {string} password Account password
 * @returns {Promise<AxiosResponse<TokenDTO>>} Returns the API response
 */
// eslint-disable-next-line import/prefer-default-export
export const createToken = (username, password) => {
  return instance.post("/tokens", {
    username,
    password,
  });
};
