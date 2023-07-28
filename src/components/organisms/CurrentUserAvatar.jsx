import React from 'react';
import {useSelector} from 'react-redux';
import Avatar from '../atoms/Avatar';
import {useCurrentUserAvatar} from '../../contexts/CurrentUserAvatarContext';

/**
 * Avatar component for displaying a user's avatar with a fallback to a jdenticon.
 *
 * @return {JSX.Element} The avatar component
 */
export default function CurrentUserAvatar() {
  const {avatar} = useCurrentUserAvatar();

  const principal = useSelector((state) => state.auth.principal);

  if (avatar) {
    return <img src={avatar} alt="Avatar" className="w-full h-full object-contain" />;
  } else {
    return <Avatar value={principal?.id} />;
  }
}
