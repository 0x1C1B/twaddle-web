import React from 'react';
import PropTypes from 'prop-types';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

/**
 * Guard component that protects routes from unauthenticated users.
 *
 * @return {JSX.Element} Route protector component
 */
export default function RouteProtector({children}) {
  const principal = useSelector((state) => state.auth.principal);
  const accessExpiresAt = useSelector((state) => state.auth.accessExpiresAt);
  const refreshExpiresAt = useSelector((state) => state.auth.refreshExpiresAt);

  const wasAuthenticated = principal && refreshExpiresAt && accessExpiresAt;
  const isAuthenticated = principal && (Date.now() < accessExpiresAt || Date.now() < refreshExpiresAt);

  if (isAuthenticated) {
    return children;
  } else if (wasAuthenticated) {
    return <Navigate to="/logout" />;
  } else {
    return <Navigate to="/login" />;
  }
}

RouteProtector.propTypes = {
  children: PropTypes.node.isRequired,
};
