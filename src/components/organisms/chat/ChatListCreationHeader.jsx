import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {getUserByUsername} from '../../../api/users';
import {createChat} from '../../../api/chats';
import chatsSlice from '../../../store/slices/chats';

/**
 * Header component for the chat list that allows the user to create a new chat.
 *
 * @return {JSX.Element} The header component
 */
export default function ChatListCreationHeader({onNewChat, onReturn}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const schema = yup.object().shape({
    username: yup.string().required('Is required'),
  });

  const onAddChat = useCallback(
    async (values, {resetForm}) => {
      setError(null);
      setLoading(true);

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
          onNewChat(chat.id);
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
            storedMessages: {},
            storedMessagesLoaded: false,
            liveMessages: [],
          }),
        );

        onNewChat(chatRes.data.id);
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
        setLoading(false);
        resetForm();
      }
    },
    [chats, principal],
  );

  return (
    <div className="border-b border-slate-300 px-4">
      <div className="flex py-3 justify-left items-center h-16 space-x-2">
        <Button
          onClick={() => onReturn()}
          className={
            'flex items-center justify-center focus:!outline-none !border-0 ' + '!bg-slate-100 disabled:brightness-100'
          }
        >
          <FontAwesomeIcon className="h-4 w-4 text-slate-800 lg:h-5 lg:w-5" icon={faArrowLeft} />
        </Button>
        <h2 className="text-xl font-semibold">New Chat</h2>
      </div>
      <div className="pb-3 space-y-2">
        <Formik initialValues={{username: ''}} validationSchema={schema} onSubmit={onAddChat}>
          {(formikProps) => (
            <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
              <div className="grow flex relative items-center">
                <TextField
                  name="username"
                  placeholder="Enter user's name"
                  disabled={loading}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  value={formikProps.values.username}
                  touched={formikProps.errors.username && formikProps.touched.username}
                  className="h-10 pr-14"
                />
                {(loading || (formikProps.isValid && formikProps.dirty)) && (
                  <div className="absolute right-0 mr-2">
                    <Button
                      type="submit"
                      disabled={!(formikProps.isValid && formikProps.dirty) || loading}
                      className={
                        'flex items-center justify-center focus:!outline-none !border-0 ' +
                        '!bg-white disabled:brightness-100'
                      }
                    >
                      {!loading && <FontAwesomeIcon icon={faPlus} className="w-4 h-4 lg:h-5 lg:w-5" />}
                      {loading && (
                        <div className="w-4 h-4 lg:h-5 lg:w-5 border-b-2 border-sky-500 rounded-full animate-spin" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          )}
        </Formik>
        {error && <p className="text-left text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

ChatListCreationHeader.propTypes = {
  onNewChat: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};
