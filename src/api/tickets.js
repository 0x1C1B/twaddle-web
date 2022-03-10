// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import instance from "./instance";

/**
 * @typedef {object} TicketDTO
 * @property {"Ticket"} type
 * @property {string} ticket
 * @property {string} subject
 * @property {string} expires
 */

/**
 * Generates a ticket for websocket access on the server side.
 *
 * @returns {Promise<AxiosResponse<TicketDTO>>} Returns the API response
 */
// eslint-disable-next-line import/prefer-default-export
export const createTicket = () => {
  return instance.post("/tickets", null);
};
