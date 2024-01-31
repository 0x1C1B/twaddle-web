import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {updateGroupChateById} from '../../../api/chats';

/**
 * Form component for the group profile that allows to update the group name.
 *
 * @return {JSX.Element} The component
 */
export default function UpdateGroupChatNameForm({group, onChange}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const principal = useSelector((state) => state.auth.principal);
  const chats = useSelector((state) => state.chats.chats);

  const schema = yup.object().shape({
    name: yup.string().max(75, 'Must be 75 characters or less').required('Is required'),
  });

  const onChangeName = useCallback(
    async (values, {resetForm}) => {
      setError(null);
      setLoading(true);

      try {
        if (values.name === group.name) {
          setError('The new name must be different from the old one.');
          return;
        }

        await updateGroupChateById(group.id, {
          name: values.name,
        });

        onChange();
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
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
      <Formik initialValues={{name: ''}} validationSchema={schema} onSubmit={onChangeName}>
        {(formikProps) => (
          <form className="flex w-full flex items-center space-x-4" onSubmit={formikProps.handleSubmit} noValidate>
            <div className="grow flex relative items-center">
              <TextField
                name="name"
                placeholder="New group name"
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
                    {!loading && <FontAwesomeIcon icon={faCheck} className="w-4 h-4 lg:h-5 lg:w-5" />}
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

UpdateGroupChatNameForm.propTypes = {
  group: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
