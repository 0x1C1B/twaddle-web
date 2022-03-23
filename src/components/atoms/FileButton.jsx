import React, { useRef } from "react";

/**
 * @typedef {object} FileButtonProperties
 * @property {"primary"|"secondary"=} variant
 * @property {JSX.Element=} children
 * @property {string=} className
 * @property {React.ChangeEventHandler} onChange
 */

/**
 * Constructs a file button component.
 *
 * @param {FileButtonProperties} properties The button properties
 * @returns {JSX.Element} Returns the button component
 */
export default function FileButton({
  children,
  variant = "primary",
  className,
  onChange,
  ...props
}) {
  const inputRef = useRef();

  return (
    <>
      <button
        className={`group relative py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none ${
          variant === "primary"
            ? "bg-lime-500 focus:outline-lime-500"
            : "bg-amber-500 focus:outline-amber-500"
        } hover:brightness-110 disabled:opacity-50 ${className}`}
        {...props}
        onClick={() => inputRef.current.click()}
      >
        {children}
      </button>
      <input
        onChange={onChange}
        multiple={false}
        ref={inputRef}
        type="file"
        hidden
      />
    </>
  );
}
