// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import instance from "./instance";

/**
 * @typedef {object} RoomDTO
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} createdAt
 */

/**
 * @typedef {object} RoomPageDTO
 * @property {[RoomDTO]} content
 * @property {{perPage: number, page: number, totalElements: number, totalPages: number}} info
 */

/**
 * Loads the meta information of all available chat rooms.
 * The resource is loaded paged.
 *
 * @param {number} page Zero based index of the page to load
 * @param {string} filter Optional RSQL filter to filter the resource
 * @returns {Promise<AxiosResponse<RoomPageDTO>>} Returns the API response
 */
export const fetchRooms = (page, filter) => {
  return instance.get("/rooms", {
    params: { page, filter },
  });
};

/**
 * Loads the information of a single room based on its id.
 *
 * @param {string} id Unique identifier of the resource
 * @returns {Promise<AxiosResponse<RoomDTO>>} Returns the API response
 */
export const fetchRoom = (id) => {
  return instance.get(`/rooms/${id}`);
};

/**
 * Create a new chat room.
 *
 * @param {{name: string, description: string}} data Fields of the new room to be created
 * @returns {Promise<AxiosResponse<RoomDTO>>} Returns the API response
 */
export const createRoom = (data) => {
  return instance.post("/rooms", data);
};

/**
 * Update an existing chat room by its identifier.
 *
 * @param {string} id Unique identifier of the resource
 * @param {{name: string|undefined, description: string|undefined}} data Fields of the room to be updated
 * @returns {Promise<AxiosResponse<RoomDTO>>} Returns the API response
 */
export const updateRoom = (id, data) => {
  return instance.patch(`/rooms/${id}`, data);
};

/**
 * Deletes an existing chat room by its identifier.
 *
 * @param {string} id Unique identifier of the resource
 * @returns {Promise<AxiosResponse>} Returns the API response
 */
export const deleteRoom = (id) => {
  return instance.delete(`/rooms/${id}`);
};
