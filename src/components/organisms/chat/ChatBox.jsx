import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faPaperPlane, faExclamationTriangle, faArrowsRotate} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useTwaddleChat} from '../../../contexts/TwaddleChatContext';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import UserAvatar from '../UserAvatar';
import Avatar from '../../atoms/Avatar';
import Message from './Message';
import MessageSkeleton from './MessageSkeleton';
import EmojiPicker from './EmojiPicker';
import chatsSlice from '../../../store/slices/chats';
import {getMessagesOfChat} from '../../../api/chats';

/**
 * A component that displays the messages of a selected chat.
 *
 * @return {JSX.Element} The message box component
 */
export default function ChatBox({selectedChat, onBackButtonClick}) {
  const dispatch = useDispatch();
  const twaddleChat = useTwaddleChat();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [, setErrorSend] = useState(null);
  const [loadingSend, setLoadingSend] = useState(false);

  const chat = useSelector(
    (state) => state.chats.chats.find((chat) => chat.id === selectedChat.id && chat.type === selectedChat.type),
    [selectedChat],
  );
  const timestampOffset = useSelector((state) => state.chats.timestampOffset);

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
    setErrorSend(null);
    setLoadingSend(true);

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
      setErrorSend('An unexpected error occurred, please retry.');

      throw err;
    } finally {
      setLoadingSend(false);
      resetForm();
    }
  }, []);

  const onFetchMessages = useCallback(
    async (_page) => {
      setLoading(true);
      setError(null);

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
          setError('An unexpected error occurred, please retry!');
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectedChat, timestampOffset],
  );

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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-gray-100 border-b border-slate-300 px-2 py-3 h-16">
        <div className="flex items-center space-x-2">
          <div className="lg:hidden">
            <Button
              onClick={onBackButtonClick}
              className={
                'flex items-center justify-center focus:!outline-none !border-0 ' +
                '!bg-slate-100 disabled:brightness-100'
              }
            >
              <FontAwesomeIcon className="h-4 w-4 text-slate-800 lg:h-5 lg:w-5" icon={faArrowLeft} />
            </Button>
          </div>
          {selectedChat.type === 'private' ? (
            <div className="flex space-x-4 items-center overflow-hidden">
              <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <UserAvatar userId={chat.participants[0].id} />
                </div>
              </div>
              <div className="space-y-1 overflow-hidden">
                <span className="block truncate font-semibold">{chat.name}</span>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4 items-center overflow-hidden">
              <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <Avatar value={chat.name} />
                </div>
              </div>
              <div className="space-y-1 overflow-hidden">
                <span className="block truncate font-semibold">{chat.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        onScroll={onMessageBoxScroll}
        ref={messageBoxRef}
        className="grow h-0 overflow-hidden overflow-y-auto p-4 space-y-2"
      >
        {loading &&
          Array.from(Array(5).keys()).map((value) => <MessageSkeleton key={value} isOwner={value % 2 === 0} />)}
        {!loading &&
          (error ? (
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
                <MessageSkeleton key={value} error={error} isOwner={value % 2 === 0} />
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
                    disabled={loadingSend || loading}
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
                    disabled={loadingSend || loading}
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
                {(loadingSend || (formikProps.isValid && formikProps.dirty)) && (
                  <Button
                    type="submit"
                    disabled={!(formikProps.isValid && formikProps.dirty) || loadingSend || loading}
                    className={
                      'flex items-center justify-center focus:!outline-none !border-0 ' +
                      '!bg-slate-100 disabled:brightness-100'
                    }
                  >
                    {!loadingSend && (
                      <FontAwesomeIcon icon={faPaperPlane} className="text-slate-800 h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                    {loadingSend && (
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
