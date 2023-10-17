import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPaperPlane,
  faExclamationTriangle,
  faArrowsRotate,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useTwaddleChat} from '../../../contexts/TwaddleChatContext';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import UserAvatar from '../UserAvatar';
import Avatar from '../../atoms/Avatar';
import Message from '../../molecules/chat/Message';
import MessageSkeleton from '../../molecules/chat/MessageSkeleton';
import EmojiPicker from './EmojiPicker';
import UserProfileDialog from './UserProfileDialog';
import GroupProfileDialog from './GroupProfileDialog';
import chatsSlice from '../../../store/slices/chats';
import usersSlice from '../../../store/slices/users';
import {getMessagesOfChat} from '../../../api/messages';
import {getStatusById} from '../../../api/users';

/**
 * A component that displays the messages of a selected chat.
 *
 * @return {JSX.Element} The message box component
 */
export default function ChatBox({selectedChat, onBackButtonClick}) {
  const dispatch = useDispatch();
  const twaddleChat = useTwaddleChat();

  const [messagesError, setMessagesError] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [statusError, setStatusError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [, setSendError] = useState(null);
  const [sendLoading, setSendLoading] = useState(false);

  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showGroupProfileModal, setShowGroupProfileModal] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chat = useSelector(
    (state) => state.chats.chats.find((chat) => chat.id === selectedChat.id && chat.type === selectedChat.type),
    [selectedChat],
  );
  const timestampOffset = useSelector((state) => state.chats.timestampOffset);
  const onlineUsers = useSelector((state) => state.users.online);

  const schema = yup.object().shape({
    message: yup.string().required('Is required'),
  });

  const messageBoxRef = useRef();
  const [messageBoxStickyBottom, setMessageBoxStickyBottom] = useState(true);

  const onMessageBoxScroll = useCallback(() => {
    if (messageBoxRef.current) {
      const isAtBottom =
        messageBoxRef.current.scrollTop >= messageBoxRef.current.scrollHeight - messageBoxRef.current.offsetHeight;

      if (isAtBottom) {
        setMessageBoxStickyBottom(true);
      } else {
        setMessageBoxStickyBottom(false);
      }
    }
  }, []);

  const onSend = useCallback(async (values, {resetForm}) => {
    setSendError(null);
    setSendLoading(true);

    try {
      if (selectedChat.type === 'private') {
        await twaddleChat.sendPrivateMessage({
          to: chat.id,
          content: values.message,
        });
      } else {
        await twaddleChat.sendGroupMessage({
          to: chat.id,
          content: values.message,
        });
      }
    } catch (err) {
      setSendError('An unexpected error occurred, please retry.');

      throw err;
    } finally {
      setSendLoading(false);
      resetForm();
    }
  }, []);

  const onFetchMessages = useCallback(
    async (_page) => {
      setMessagesLoading(true);
      setMessagesError(null);

      try {
        const messagesRes = await getMessagesOfChat(selectedChat.id, selectedChat.type, _page, 25, timestampOffset);

        if (messagesRes.data.info.totalElements > 0) {
          dispatch(
            chatsSlice.actions.setStoredMessages({
              chatId: selectedChat.id,
              type: selectedChat.type,
              messages: messagesRes.data.content.reverse(),
              page: messagesRes.data.info.page,
            }),
          );

          if (messagesRes.data.info.page === messagesRes.data.info.totalPages - 1) {
            dispatch(chatsSlice.actions.setStoredMessagesLoaded({chatId: selectedChat.id, type: selectedChat.type}));
          }
        }
      } catch (err) {
        if (err.response && err.response.data?.code === 'InvalidTokenError') {
          navigate('/login');
        } else {
          setMessagesError('An unexpected error occurred, please retry!');
        }

        throw err;
      } finally {
        setMessagesLoading(false);
      }
    },
    [selectedChat, timestampOffset],
  );

  const onFetchStatus = useCallback(async (userId) => {
    setStatusLoading(true);
    setStatusError(null);

    try {
      const statusRes = await getStatusById(userId);

      if (statusRes.data.status === 'online') {
        dispatch(usersSlice.actions.markUserOnline(userId));
      } else {
        dispatch(usersSlice.actions.markUserOffline(userId));
      }
    } catch (err) {
      if (err.response && err.response.data?.code === 'InvalidTokenError') {
        navigate('/login');
      } else {
        setStatusError('An unexpected error occurred, please retry!');
      }

      throw err;
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (messageBoxStickyBottom) {
      messageBoxRef.current.scrollTo(0, messageBoxRef.current.scrollHeight);
    }
  }, [chat.storedMessages, chat.liveMessages, messageBoxStickyBottom]);

  useEffect(() => {
    if (onFetchMessages && Object.keys(chat.storedMessages).length === 0) {
      onFetchMessages(0);
    }
  }, [onFetchMessages, chat]);

  useEffect(() => {
    if (onFetchStatus && chat?.type === 'private') {
      onFetchStatus(chat.participants.filter((participant) => participant.id !== principal.id)[0].id);
    }
  }, [onFetchStatus, chat]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-gray-100 border-b border-slate-300 px-2 py-2 h-16">
        <div className="flex items-center space-x-2">
          <div className="lg:hidden">
            <Button
              onClick={onBackButtonClick}
              className={
                'flex items-center justify-center focus:!outline-none !border-0 ' +
                '!bg-slate-100 disabled:brightness-100'
              }
            >
              <FontAwesomeIcon className="h-[1.25rem] w-[1.25rem] text-slate-800" icon={faArrowLeft} />
            </Button>
          </div>
          <div className="h-12 p-1 flex items-center overflow-hidden">
            {selectedChat.type === 'private' ? (
              <>
                <div
                  className="flex space-x-4 items-center overflow-hidden hover:cursor-pointer"
                  onClick={() => setShowUserProfileModal(true)}
                >
                  <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <UserAvatar
                        userId={chat.participants.filter((participant) => participant.id !== principal.id)[0].id}
                      />
                    </div>
                  </div>
                  <div className="h-10 overflow-hidden">
                    <div className="truncate font-semibold">{chat.name}</div>
                    <div className="text-xs">
                      {!statusError &&
                        !statusLoading &&
                        (onlineUsers.includes(
                          chat.participants.filter((participant) => participant.id !== principal.id)[0].id,
                        ) ? (
                          <div className="flex space-x-1 items-center">
                            <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-green-500" />
                            <span className="truncate">online</span>
                          </div>
                        ) : (
                          <div className="flex space-x-1 items-center">
                            <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-slate-400" />
                            <span className="truncate">offline</span>
                          </div>
                        ))}
                      {statusError && (
                        <div className="flex space-x-1 items-center">
                          <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-slate-400" />
                          <span className="text-red-500 truncate">Failed to load status</span>
                        </div>
                      )}
                      {statusLoading && (
                        <div className="flex space-x-1 items-center">
                          <FontAwesomeIcon icon={faCircle} className="h-2 w-2 text-slate-400" />
                          <span className="truncate">Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <UserProfileDialog
                  userId={chat.participants.filter((participant) => participant.id !== principal.id)[0].id}
                  onClose={() => setShowUserProfileModal(false)}
                  isOpen={showUserProfileModal}
                />
              </>
            ) : (
              <>
                <div
                  className="flex space-x-4 items-center overflow-hidden hover:cursor-pointer"
                  onClick={() => setShowGroupProfileModal(true)}
                >
                  <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <Avatar value={chat.name} />
                    </div>
                  </div>
                  <div className="h-10 overflow-hidden">
                    <div className="block truncate font-semibold">{chat.name}</div>
                    <div className="text-xs truncate max-w-sm">
                      {[
                        'You',
                        ...chat.participants
                          .filter((participant) => participant.id !== principal.id)
                          .map((participant) => participant.displayName || participant.username),
                      ].join(', ')}
                    </div>
                  </div>
                </div>
                <GroupProfileDialog
                  chatId={selectedChat.id}
                  onClose={() => setShowGroupProfileModal(false)}
                  isOpen={showGroupProfileModal}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div
        onScroll={onMessageBoxScroll}
        ref={messageBoxRef}
        className="grow h-0 overflow-hidden overflow-y-auto p-4 space-y-2"
      >
        {messagesLoading &&
          Array.from(Array(5).keys()).map((value) => <MessageSkeleton key={value} isOwner={value % 2 === 0} />)}
        {!messagesLoading &&
          (messagesError ? (
            <>
              <div className="flex justify-center mb-4">
                <div
                  className={'text-red-500 flex justify-center items-center space-x-2 bg-slate-200 p-2 w-fit rounded'}
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span className="text-sm">There seems to be an error loading the messages.</span>
                </div>
              </div>
              {Array.from(Array(5).keys()).map((value) => (
                <MessageSkeleton key={value} error={messagesError} isOwner={value % 2 === 0} />
              ))}
            </>
          ) : (
            <>
              {Object.keys(chat.storedMessages).length !== 0 && !chat.storedMessagesLoaded && (
                <div className="flex justify-center mb-4">
                  <button
                    className={'flex justify-center items-center space-x-2 bg-slate-200 p-2 w-fit rounded'}
                    onClick={() => onFetchMessages(Object.keys(chat.storedMessages).length)}
                  >
                    <FontAwesomeIcon icon={faArrowsRotate} />
                    <span className="text-sm">Load more</span>
                  </button>
                </div>
              )}
              {Object.values(chat.storedMessages)
                .reverse()
                .flat()
                .map((message, index) => (
                  <Message key={index} message={message} chat={chat} />
                ))}
              {chat.liveMessages.map((message, index) => (
                <Message key={index} message={message} chat={chat} />
              ))}
            </>
          ))}
      </div>
      <div className="bg-slate-100 border-t border-slate-300 px-2 py-1">
        <Formik initialValues={{message: ''}} validationSchema={schema} onSubmit={onSend}>
          {(formikProps) => (
            <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
              <div className="grow flex items-center rounded-md space-x-2">
                <div className="h-full flex items-center">
                  <EmojiPicker
                    disabled={sendLoading || messagesLoading}
                    onSelect={(emoji) =>
                      formikProps.setFieldValue('message', `${formikProps.values.message}${emoji.native}`)
                    }
                  />
                </div>
                <div className="grow">
                  <TextField
                    autoFocus
                    name="message"
                    autoComplete="off"
                    placeholder="Enter your message"
                    disabled={sendLoading || messagesLoading}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.message}
                    touched={formikProps.errors.message && formikProps.touched.message}
                    className={
                      '!h-10 !bg-slate-100 focus:!placeholder:text-slate-400 !text-slate-800 ' +
                      'placeholder:!text-slate-800 !border-0 focus:!outline-none !p-0 disabled:brightness-100'
                    }
                  />
                </div>
                {(sendLoading || (formikProps.isValid && formikProps.dirty)) && (
                  <Button
                    type="submit"
                    disabled={!(formikProps.isValid && formikProps.dirty) || sendLoading || messagesLoading}
                    className={
                      'flex items-center justify-center focus:!outline-none !border-0 ' +
                      '!bg-slate-100 disabled:brightness-100'
                    }
                  >
                    {!sendLoading && (
                      <FontAwesomeIcon icon={faPaperPlane} className="text-slate-800 h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                    {sendLoading && (
                      <div className="w-4 h-4 lg:h-5 lg:w-5 border-b-2 border-sky-500 rounded-full animate-spin" />
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

ChatBox.propTypes = {
  selectedChat: PropTypes.object.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
};
