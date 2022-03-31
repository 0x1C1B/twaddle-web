import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshIcon } from "@heroicons/react/solid";
import Avatar from "../atoms/Avatar";
import { fetchAttachmentRaw } from "../../api/attachments";

/**
 * @typedef {object} ImageMessageProperties
 * @property {{type: "IMAGE", id: string, attachment: string, user: string, room: string, timestamp: string}} message
 * @property {string} principal
 */

/**
 * Constructs a image message component.
 *
 * @param {ImageMessageProperties} properties The message properties
 * @returns Returns the message component
 */
export default function ImageMessage({ message, principal }) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState(null);

  const onFetchImage = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const attachmentRes = await fetchAttachmentRaw(id);
      setAttachment(URL.createObjectURL(new Blob([attachmentRes.data])));
    } catch (err) {
      if (err.response && err.response.data?.code === "InvalidTokenError") {
        navigate("/login");
      } else if (err.response && err.response.data?.code === "NotFoundError") {
        navigate("/404");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      onFetchImage(message.attachment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <div
      key={message.timestamp}
      className={`w-fit min-w-[15rem] max-w-[100%] sm:max-w-[70%] flex items-end ${
        message.user === principal && "self-end"
      }`}
    >
      <div
        className={`grow p-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-white rounded-md flex flex-col space-y-1 ${
          message.user === principal
            ? "bg-amber-500 dark:bg-amber-500 text-white rounded-br-none order-first"
            : "rounded-bl-none"
        }`}
      >
        <div className="text-sm font-bold truncate">{message.user}</div>
        <div className="w-full">
          {loading && (
            <div className="flex justify-center items-center bg-gray-200 dark:bg-gray-700 w-64 h-64 max-w-full">
              <div className="w-6 h-6 border-b-2 border-amber-500 rounded-full animate-spin" />
            </div>
          )}
          {!loading && error && (
            <div className="flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700 w-64 h-64 max-w-full">
              <div className="text-gray-800 dark:text-white">
                Image could not be loaded.
              </div>
              <button
                type="submit"
                className="p-1 mt-2 rounded-full text-amber-500 hover:brightness-110 disabled:opacity-50"
                onClick={() => onFetchImage(message.attachment)}
              >
                <RefreshIcon className="h-8 w-8" aria-hidden="true" />
              </button>
            </div>
          )}
          {!loading && !error && <img alt="Message" src={attachment} />}
        </div>
        <div className="w-fit text-xs self-end">
          {new Date(message.timestamp).toLocaleString()}
        </div>
      </div>
      <div
        className={`h-8 aspect-square rounded-md ml-2 ${
          message.user !== principal && "order-first mr-2 ml-0"
        }`}
      >
        <Avatar value={message.user} />
      </div>
    </div>
  );
}
