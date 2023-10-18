import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import Avatar from '../atoms/Avatar';
import {getUserAvatar} from '../../api/users';

/**
 * Avatar component for displaying a user's avatar with a fallback to a jdenticon.
 *
 * @return {JSX.Element} The avatar component
 */
export default function UserAvatar({userId}) {
  const navigate = useNavigate();

  const [avatar, setAvatar] = React.useState(null);

  const getAvatar = useCallback(async (_userId) => {
    try {
      const response = await getUserAvatar(_userId);
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

  useEffect(() => {
    getAvatar(userId).then((avatar) => setAvatar(avatar));
  }, [userId, getAvatar]);

  if (avatar) {
    return <img src={avatar} alt="Avatar" className="w-full h-full object-contain" />;
  } else {
    return <Avatar value={userId} />;
  }
}

UserAvatar.propTypes = {
  userId: PropTypes.string.isRequired,
};
