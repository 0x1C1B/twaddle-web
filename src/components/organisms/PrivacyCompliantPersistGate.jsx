import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

/**
 * A component that initiates the persistence of the application state. The
 * application state is only persisted if the user has allowed it.
 *
 * @return {JSX.Element} Privacy compliant persist gate component
 */
export default function PrivacyCompliantPersistGate({children, persistor, loading}) {
  const webStorageAllowed = useSelector((state) => state.privacy.webStorageAllowed);

  useEffect(() => {
    if (webStorageAllowed) {
      persistor.persist();
    }
  }, [webStorageAllowed, persistor]);

  return (
    <PersistGate persistor={persistor} loading={loading}>
      {children}
    </PersistGate>
  );
}

PrivacyCompliantPersistGate.propTypes = {
  children: PropTypes.node.isRequired,
  persistor: PropTypes.object.isRequired,
  loading: PropTypes.node,
};
