import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import * as jdenticon from 'jdenticon';

/**
 * Avatar component for displaying a user's avatar.
 *
 * @return {JSX.Element} The avatar component
 */
export default function Avatar({value}) {
  const icon = useRef(null);

  useEffect(() => {
    jdenticon.updateSvg(icon.current, value);
  }, [value]);

  return <svg data-jdenticon-value={value} ref={icon} height="100%" width="100%" />;
}

Avatar.propTypes = {
  value: PropTypes.string.isRequired,
};
