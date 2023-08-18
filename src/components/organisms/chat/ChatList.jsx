import React, {useState, useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import UserAvatar from '../UserAvatar';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {getUserByUsername} from '../../../api/users';
import {createChat, getCurrentUserChats} from '../../../api/chats';
import chatsSlice from '../../../store/slices/chats';

/**
 * A component that displays all available chats in a list.
 *
 * @return {JSX.Element} The list component
 */
export default function ChatList({selectedChat, onChatSelect}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const schema = yup.object().shape({
    username: yup.string().required('Is required'),
  });

  const getChats = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const chatsRes = await getCurrentUserChats();

      dispatch(
        chatsSlice.actions.setChats(
          chatsRes.data.map((chat) => ({
            id: chat.id,
            name: chat.participants[0].displayName || chat.participants[0].username,
            participants: chat.participants,
            messages: chat.messages || [],
          })),
        ),
      );
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      } else {
        setError('An unexpected error occurred, please retry.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const onNewChat = useCallback(
    async (values, {resetForm}) => {
      setError(null);
      setLoadingNew(true);

      try {
        if (values.username === principal.username) {
          setError('You cannot chat with yourself.');
          return;
        }
        const chat = chats.find((chat) => {
          const participants = chat.participants.map((participant) => participant.username);
          return participants.includes(values.username);
        });

        if (chat) {
          onChatSelect(chat.id);
          resetForm();
          return;
        }

        const userRes = await getUserByUsername(values.username);

        const chatRes = await createChat({
          participants: [userRes.data.id],
        });

        dispatch(
          chatsSlice.actions.addChat({
            id: chatRes.data.id,
            name: chatRes.data.participants[0].displayName || chatRes.data.participants[0].username,
            participants: chatRes.data.participants,
            messages: [],
          }),
        );
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        } else if (err.response && err.response.status === 404) {
          setError('No user with this username was found.');
        } else {
          setError('An unexpected error occurred, please retry.');
        }

        throw err;
      } finally {
        setLoadingNew(false);
        resetForm();
      }
    },
    [chats, principal],
  );

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <div className="w-full h-full bg-gray-100 p-2 space-y-4 border-r border-slate-300 flex flex-col">
      <div className="flex p-2">
        <h2 className="text-xl font-semibold">Chats</h2>
      </div>
      <div className="p-2 space-y-2">
        <Formik initialValues={{username: ''}} validationSchema={schema} onSubmit={onNewChat}>
          {(formikProps) => (
            <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
              <div className="grow">
                <TextField
                  name="username"
                  placeholder="Enter username to chat with"
                  disabled={loadingNew}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.username}
                  touched={formikProps.errors.username && formikProps.touched.username}
                  className="h-10"
                />
              </div>
              <Button
                type="submit"
                disabled={!(formikProps.isValid && formikProps.dirty) || loadingNew}
                className={
                  'flex items-center justify-center !bg-green-600 focus:!outline-green-600 !rounded-full !p-2' +
                  ' !text-white h-10 w-10'
                }
              >
                {!loadingNew && <FontAwesomeIcon icon={faPlus} />}
                {loadingNew && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
              </Button>
            </form>
          )}
        </Formik>
        {error && <p className="text-left text-xs text-red-500">{error}</p>}
      </div>
      <div className="px-2">
        <hr className="w-full border-slate-300" />
      </div>
      {loading}
      {!chats || chats.length === 0 ? (
        <div className="text-center">
          <span>No conversations were found.</span>
        </div>
      ) : (
        <ul className="space-y-2 grow h-0 overflow-hidden overflow-y-auto px-2">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`hover:bg-slate-200 rounded p-2 cursor-pointer ${
                selectedChat === chat.id ? 'bg-slate-300 hover:bg-slate-300' : ''
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ChatList.propTypes = {
  selectedChat: PropTypes.string,
  onChatSelect: PropTypes.func.isRequired,
};
