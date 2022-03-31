import Avatar from "../atoms/Avatar";

/**
 * @typedef {object} TextMessageProperties
 * @property {{type: "TEXT", id: string, content: string, user: string, room: string, timestamp: string}} message
 * @property {string} principal
 */

/**
 * Constructs a text message component.
 *
 * @param {TextMessageProperties} properties The message properties
 * @returns Returns the message component
 */
export default function TextMessage({ message, principal }) {
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
        <div className="w-full break-all whitespace-pre-wrap">
          {message.content}
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
