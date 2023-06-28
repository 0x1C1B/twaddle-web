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
          'relative bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-300 ' +
          'placeholder-gray-400 border block w-full px-3 py-2 rounded-md focus:outline-none focus:outline-sky-500 ' +
          `disabled:brightness-75 ${
            error && touched ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
          } ${className}`
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
