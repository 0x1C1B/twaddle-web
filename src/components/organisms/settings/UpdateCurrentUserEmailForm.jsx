import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {updateCurrentUser} from '../../../api/users';
import authSlice from '../../../store/slices/auth';

/**
 * Form for updating the user's email address.
 *
 * @return {JSX.Element} The form component
 */
export default function UpdateCurrentUserEmailForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    email: yup.string().email().required('Is required'),
  });

  const principal = useSelector((state) => state.auth.principal);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onUpdate = async (values, {setFieldError, resetForm}) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const userRes = await updateCurrentUser({
        email: values.email,
      });

      dispatch(authSlice.actions.setPrincipal(userRes.data));

      resetForm();
      setSuccess(true);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) => setFieldError(detail.field, detail.message));
      } else if (err.response && err.response.status === 401) {
        navigate('/logout');
      } else {
        setError('An unexpected error occurred, please retry.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl">Change email</h2>
        <hr className="border-gray-300 dark:border-gray-400 mt-2" />
      </div>
      <p>
        Your email address will be used for account verification and for administrative purposes. At no time will your
        email be made public. If you change your e-mail address, it must be verified again and certain functions may be
        restricted until then.
      </p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && <p className="text-left text-green-600">Changed password successfully.</p>}
      <div className="w-full">
        <Formik
          enableReinitialize={true}
          initialValues={{email: principal.email || ''}}
          onSubmit={onUpdate}
          validationSchema={schema}
        >
          {(formikProps) => (
            <form className="flex flex-col w-full space-y-4" onSubmit={formikProps.handleSubmit} noValidate>
              <div>
                <TextField
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formikProps.values.email}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.email}
                  touched={formikProps.errors.email && formikProps.touched.email}
                  disabled={loading}
                  className="grow"
                />
              </div>
              <Button type="submit" disabled={!(formikProps.isValid && formikProps.dirty) || loading} className="w-fit">
                Change email
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
