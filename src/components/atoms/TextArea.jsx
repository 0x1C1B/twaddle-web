/**
 * @typedef {object} TextAreaProperties
 * @property {any} onChange
 * @property {any} onBlur
 * @property {string} value
 * @property {boolean} touched
 * @property {string} error
 * @property {string} className
 */

/**
 * Constructs a text area component.
 *
 * @param {TextAreaProperties} properties The text area properties
 * @returns Returns the text area component
 */
export default function TextArea({
  onChange,
  onBlur,
  value,
  error,
  touched,
  className,
  ...props
}) {
  return (
    <>
      <textarea
        className={`relative bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border ${
          error && touched
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-500"
        } block w-full px-3 py-2 rounded-md focus:outline-none focus:outline-lime-500 disabled:opacity-50 ${className}`}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
}
