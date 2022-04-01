// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from "axios";
import instance from "./instance";

/**
 * @typedef {object} AttachmentDTO
 * @property {string} id
 * @property {number} size
 * @property {string} path
 * @property {string} mimeType
 */

/**
 * Loads the binary representation of an attachment
 *
 * @param {string} id Unique identifier of the resource
 * @returns {Promise<AxiosResponse<any>>} Returns the API response
 */
export const fetchAttachmentRaw = (id) => {
  return instance.get(`/attachments/${id}/raw`, {
    responseType: "blob",
    timeout: 10000,
  });
};

/**
 * Uploads a new attachment.
 *
 * @param {{name: string, description: string}} data Fields of the new room to be created
 * @returns {Promise<AxiosResponse<AttachmentDTO>>} Returns the API response
 */
export const uploadAttachment = (data) => {
  return instance.post("/attachments", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
