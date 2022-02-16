/**
 * @typedef {object} TextFieldProperties
 * @property {any} onChange
 * @property {any} onBlur
 * @property {string} value
 * @property {boolean} touched
 * @property {string} error
 * @property {string} className
 */

/**
 * Constructs a text field component.
 *
 * @param {TextFieldProperties} properties The text field properties
 * @returns Returns the text field component
 */
export default function TextField({
  onChange,
  onBlur,
  value,
  error,
  touched,
  className,
  ...props
}) {
  return (
    <div>
      <input
        className={`relative bg-white dark:bg-gray-600 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border ${
          error && touched
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-500"
        } block w-full px-3 py-2 rounded-md focus:outline-none focus:outline-lime-500 ${className}`}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
