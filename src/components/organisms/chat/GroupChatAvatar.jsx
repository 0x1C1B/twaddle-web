import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import Avatar from '../../atoms/Avatar';
import {getGroupChatAvatar} from '../../../api/chats';

/**
 * Avatar component for displaying a group chat's avatar with a fallback to a jdenticon.
 *
 * @return {JSX.Element} The avatar component
 */
export default function GroupChatAvatar({chatId}) {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);

  const getAvatar = useCallback(async (id) => {
    try {
      const response = await getGroupChatAvatar(id);
      const blob = new Blob([response.data], {type: response.headers['content-type']});
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      } else if (err.response && err.response.status === 401) {
        navigate('/logout');
      }

      if (!err.response && !err.request) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    getAvatar(chatId).then((avatar) => setAvatar(avatar));
  }, [chatId, getAvatar]);

  if (avatar) {
    return <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />;
  } else {
    return <Avatar value={chatId} />;
  }
}

GroupChatAvatar.propTypes = {
  chatId: PropTypes.string.isRequired,
};
