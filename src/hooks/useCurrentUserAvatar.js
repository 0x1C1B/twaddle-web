import {useContext} from 'react';
import {CurrentUserAvatarContext} from '../contexts/CurrentUserAvatarContext';

/**
 * Hook for accessing the current user's avatar context.
 *
 * @return {object} The current user's avatar context
 */
export default function useCurrentUserAvatar() {
  const context = useContext(CurrentUserAvatarContext);

  if (context === undefined) {
    throw new Error('useCurrentUserAvatar() may be used only in the context of a <CurrentUserAvatarProvider>');
  }

  return context;
}
