import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {getUserByUsername} from '../../../api/users';
import {addParticipantToGroupChat} from '../../../api/chats';

/**
 * Form component for the group profile that allows the user to add a new member.
 *
 * @return {JSX.Element} The component
 */
export default function AddGroupMemberForm({group, onNewMember}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const schema = yup.object().shape({
    username: yup.string().required('Is required'),
  });

  const onAddMember = useCallback(
    async (values, {resetForm}) => {
      setError(null);
      setLoading(true);

      try {
        if (values.username === principal.username) {
          setError('You cannot add yourself to a group.');
          return;
        }

        const participants = group.participants.map((participant) => participant.username);

        if (participants.includes(values.username)) {
          setError('This user is already a member of this group.');
          return;
        }

        const userRes = await getUserByUsername(values.username);
        await addParticipantToGroupChat(group.id, {userId: userRes.data.id});

        onNewMember(userRes.data.id);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        } else if (err.response && err.response.status === 404) {
          setError('No user with this username was found.');
        } else {
          setError('An unexpected error occurred, please retry.');
        }

        if (!err.response && !err.request) {
          console.error(err);
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
      <Formik initialValues={{username: ''}} validationSchema={schema} onSubmit={onAddMember}>
        {(formikProps) => (
          <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
            <div className="grow flex relative items-center">
              <TextField
                name="username"
                placeholder="Enter new member's username"
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
  );
}

AddGroupMemberForm.propTypes = {
  group: PropTypes.object.isRequired,
  onNewMember: PropTypes.func.isRequired,
};
