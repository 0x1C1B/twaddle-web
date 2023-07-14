import React from 'react';
import PropTypes from 'prop-types';

/**
 * Default button component.
 *
 * @return {JSX.Element} Button component
 */
export default function Button({children, className, ...props}) {
  return (
    <button
      type="button"
      className={
        'group relative py-2 px-3 text-sm font-medium rounded-md outline-none bg-slate-100 ' +
        'border border-slate-300 text-slate-800' +
        `focus:outline-slate-100 hover:brightness-95 disabled:brightness-75 hover:cursor-pointer ${className}`
      }
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
