import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faPaperPlane, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useTwaddleChat} from '../../../contexts/TwaddleChatContext';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import UserAvatar from '../UserAvatar';
import Message from './Message';
import MessageSkeleton from './MessageSkeleton';
import chatsSlice from '../../../store/slices/chats';
import {getMessagesOfChat} from '../../../api/chats';

/**
 * A component that displays the messages of a selected chat.
 *
 * @return {JSX.Element} The message box component
 */
export default function MessageBox({selectedChat, onBackButtonClick}) {
  const dispatch = useDispatch();
  const twaddleChat = useTwaddleChat();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [, setErrorSend] = useState(null);
  const [loadingSend, setLoadingSend] = useState(false);

  const chat = useSelector((state) => state.chats.chats.find((chat) => chat.id === selectedChat), [selectedChat]);

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
      await twaddleChat.send({
        to: chat.id,
        content: values.message,
      });
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
        const messagesRes = await getMessagesOfChat(selectedChat, _page);

        dispatch(
          chatsSlice.actions.setStoredMessages({
            chatId: selectedChat,
            messages: messagesRes.data.content.reverse(),
            page: messagesRes.data.info.page,
          }),
        );
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
    [selectedChat],
  );

  useEffect(() => {
    if (messageBoxStickyBottom) {
      messageBoxRef.current.scrollTo(0, messageBoxRef.current.scrollHeight);
    }
  }, [chat.messages]);

  useEffect(() => {
    if (selectedChat && onFetchMessages) {
      onFetchMessages(0);
    }
  }, [selectedChat, onFetchMessages]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-gray-100 border-b border-slate-300 px-4 py-3">
        <div className="flex items-center">
          <div className="lg:hidden mr-4">
            <button onClick={onBackButtonClick}>
              <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
            </button>
          </div>
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
              {Object.values(chat.storedMessages)
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
      <div className="bg-gray-100 border-t border-slate-300 px-4 py-3">
        <Formik initialValues={{message: ''}} validationSchema={schema} onSubmit={onSend}>
          {(formikProps) => (
            <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
              <div className="grow">
                <TextField
                  autoFocus
                  name="message"
                  autocomplete="off"
                  placeholder="Enter message"
                  disabled={loadingSend || loading}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.message}
                  touched={formikProps.errors.message && formikProps.touched.message}
                  className="h-10"
                />
              </div>
              <Button
                type="submit"
                disabled={!(formikProps.isValid && formikProps.dirty) || loadingSend || loading}
                className={
                  'flex items-center justify-center !bg-sky-600 focus:!outline-sky-600 !rounded-full !p-2' +
                  ' !text-white h-10 w-10'
                }
              >
                {!loadingSend && <FontAwesomeIcon icon={faPaperPlane} />}
                {loadingSend && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

MessageBox.propTypes = {
  selectedChat: PropTypes.string.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
};
