/**
 * @typedef {object} StatusInfoProperties
 * @property {{type: "status", content: string, timestamp: string}} message
 */

/**
 * Constructs a status info component.
 *
 * @param {StatusInfoProperties} properties The status info properties
 * @returns Returns the status info component
 */
export default function StatusInfo({ message }) {
  return (
    <div
      key={message.timestamp}
      className="p-2 text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-white w-fit rounded-md self-center"
    >
      {message.content}
    </div>
  );
}
