import React from 'react';
import PropTypes from 'prop-types';

/**
 * Styled external link component.
 *
 * @return {JSX.Element} The link component
 */
export default function ExternalLink({children, type, className, ...props}) {
  if (type === 'button') {
    return (
      <a
        className={
          'block text-center group relative py-2 px-3 text-sm font-medium rounded-md text-white ' +
          'outline-none bg-sky-500 focus:outline-sky-500 hover:brightness-110 disabled:brightness-75 ' +
          `hover:cursor-pointer ${className}`
        }
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <a className={`text-sky-500 hover:brightness-110 hover:underline hover:cursor-pointer ${className}`} {...props}>
      {children}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['link', 'button']),
  className: PropTypes.string,
};
