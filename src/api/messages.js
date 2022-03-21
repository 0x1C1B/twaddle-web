// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import instance from "./instance";

/**
 * @typedef {object} MessageDTO
 * @property {string} id
 * @property {string} content
 * @property {string} username
 * @property {string} room
 * @property {string} timestamp
 */

/**
 * @typedef {object} MessagePageDTO
 * @property {[MessageDTO]} content
 * @property {{perPage: number, page: number, totalElements: number, totalPages: number}} info
 */

/**
 * Loads the meta information of all available chat room messages.
 * The resource is loaded paged.
 *
 * @param {string} roomId Unique identifier of the room
 * @param {number} page Zero based index of the page to load
 * @param {string} sort Sorting instruction for sorting the page
 * @returns {Promise<AxiosResponse<MessagePageDTO>>} Returns the API response
 */
export const fetchMessages = (roomId, page, sort) => {
  return instance.get(`/rooms/${roomId}/messages`, {
    params: { page, sort },
  });
};

/**
 * Loads the information of a single room message based on its id.
 *
 * @param {string} roomId Unique identifier of the room
 * @param {string} messageId Unique identifier of the resource
 * @returns {Promise<AxiosResponse<MessageDTO>>} Returns the API response
 */
export const fetchMessage = (roomId, messageId) => {
  return instance.get(`/rooms/${roomId}/messages/${messageId}`);
};
