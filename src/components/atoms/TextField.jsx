import React from 'react';
import PropTypes from 'prop-types';

/**
 * Default text field component.
 *
 * @return {JSX.Element} Text field component
 */
export default function TextField({onChange, onBlur, value, label, error, touched, className, ...props}) {
  return (
    <>
      {label && <p className="mb-1 text-sm">{label}</p>}
      <input
        className={
          'relative bg-white text-gray-800 placeholder:text-gray-400 ' +
          'block w-full px-3 py-2 rounded-md disabled:cursor-not-allowed ' +
          'border border-slate-200 border-b-2 border-b-slate-400 ' +
          'focus:border-b-sky-500 focus:outline-none disabled:brightness-75 ' +
          `${error && touched && 'border-b-red-500'} ${className}`
        }
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
}

TextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  className: PropTypes.string,
};
