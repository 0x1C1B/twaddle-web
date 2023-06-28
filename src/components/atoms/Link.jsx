import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';

/**
 * Default link component.
 *
 * @return {JSX.Element} The link component
 */
export default function Link({children, type, className, ...props}) {
  if (type === 'button') {
    return (
      <RouterLink
        className={
          'block text-center group relative py-2 px-3 text-sm font-medium rounded-md text-white ' +
          'outline-none bg-sky-500 focus:outline-sky-500 hover:brightness-110 disabled:brightness-75 ' +
          `hover:cursor-pointer ${className}`
        }
        {...props}
      >
        {children}
      </RouterLink>
    );
  }

  return (
    <RouterLink
      className={`text-sky-500 hover:brightness-110 hover:underline hover:cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['link', 'button']),
  className: PropTypes.string,
};
