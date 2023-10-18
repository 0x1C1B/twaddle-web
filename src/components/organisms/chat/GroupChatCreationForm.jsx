import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {createChat} from '../../../api/chats';
import chatsSlice from '../../../store/slices/chats';

/**
 * Form component for the chat list that allows the user to create a new group chat.
 *
 * @return {JSX.Element} The header component
 */
export default function GroupChatCreationForm({onNewChat}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const schema = yup.object().shape({
    name: yup.string().required('Is required'),
  });

  const onAddChat = useCallback(
    async (values, {resetForm}) => {
      setError(null);
      setLoading(true);

      try {
        const chatRes = await createChat(
          {
            name: values.name,
          },
          'group',
        );

        dispatch(
          chatsSlice.actions.addChat({
            chat: chatRes.data,
            type: 'group',
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
      } finally {
        setLoading(false);
        resetForm();
      }
    },
    [chats, principal],
  );

  return (
    <div className="space-y-1">
      <Formik initialValues={{name: ''}} validationSchema={schema} onSubmit={onAddChat}>
        {(formikProps) => (
          <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
            <div className="grow flex relative items-center">
              <TextField
                name="name"
                placeholder="Group name"
                disabled={loading}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.name}
                touched={formikProps.errors.name && formikProps.touched.name}
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
  );
}

GroupChatCreationForm.propTypes = {
  onNewChat: PropTypes.func.isRequired,
};
