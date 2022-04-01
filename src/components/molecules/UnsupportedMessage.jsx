import Avatar from "../atoms/Avatar";

/**
 * @typedef {object} UnsupportedMessageProperties
 * @property {{type: string, id: string, content: string|undefined, attachment: string|undefined, user: string, room: string, timestamp: string}} message
 * @property {string} principal
 */

/**
 * Constructs an unsupported message component.
 *
 * @param {UnsupportedMessageProperties} properties The message properties
 * @returns Returns the message component
 */
export default function UnsupportedMessage({ message, principal }) {
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
          <div className="flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-700 w-64 h-64 max-w-full">
            <div className="text-gray-800 dark:text-white text-center">
              Unsupported binary file could not be loaded.
            </div>
          </div>
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
