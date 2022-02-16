/**
 * @typedef {object} ButtonProperties
 * @property {"primary"|"secondary"=} variant
 * @property {JSX.Element=} children
 * @property {string=} className
 */

/**
 * Constructs a button component.
 *
 * @param {ButtonProperties} properties The button properties
 * @returns {JSX.Element} Returns the button component
 */
export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}) {
  return (
    <button
      className={`group relative py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none ${
        variant === "primary"
          ? "bg-lime-500 focus:outline-lime-500"
          : "bg-amber-500 focus:outline-amber-500"
      } hover:brightness-110 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
