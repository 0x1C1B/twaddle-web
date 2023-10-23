import React, {createContext, useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {getCurrentUserAvatar} from '../api/users';

export const CurrentUserAvatarContext = createContext(null);

/**
 * Provider for the current user's avatar.
 *
 * @return {JSX.Element} The current user's avatar provider
 */
export function CurrentUserAvatarProvider({children}) {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const getAvatar = useCallback(async () => {
    try {
      const response = await getCurrentUserAvatar();
      const blob = new Blob([response.data], {type: response.headers['content-type']});
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      } else if (err.response && err.response.status === 401) {
        navigate('/logout');
      }
    }
  }, []);

  const reloadAvatar = useCallback(async () => {
    const newAvatar = await getAvatar();
    setAvatar(newAvatar);
  }, [getAvatar]);

  useEffect(() => {
    reloadAvatar();
  }, [reloadAvatar]);

  return (
    <CurrentUserAvatarContext.Provider
      value={{
        avatar,
        updateAvatar,
        reloadAvatar,
      }}
    >
      {children}
    </CurrentUserAvatarContext.Provider>
  );
}

CurrentUserAvatarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
