import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Formik} from 'formik';
import * as yup from 'yup';
import TextField from '../../atoms/TextField';
import Button from '../../atoms/Button';
import {updateCurrentUser} from '../../../api/users';

/**
 * Form for updating the user's password.
 *
 * @return {JSX.Element} The form component
 */
export default function UpdateCurrentUserPasswordForm() {
  const navigate = useNavigate();

  const schema = yup.object().shape({
    password: yup.string().required('Is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Is required'),
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const onUpdate = async (values, {setFieldError, resetForm}) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await updateCurrentUser({
        password: values.password,
      });

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl">Change password</h2>
        <hr className="border-gray-300 dark:border-gray-400 mt-2" />
      </div>
      <p>Change your account credentials. Changing your password will take effect the next time you log in.</p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && <p className="text-left text-green-600">Changed password successfully.</p>}
      <div className="w-full">
        <Formik initialValues={{password: '', confirmPassword: ''}} onSubmit={onUpdate} validationSchema={schema}>
          {(formikProps) => (
            <form className="flex flex-col w-full space-y-4" onSubmit={formikProps.handleSubmit} noValidate>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="grow">
                  <TextField
                    type="password"
                    name="password"
                    placeholder={'Password'}
                    value={formikProps.values.password}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    error={formikProps.errors.password}
                    touched={formikProps.errors.password && formikProps.touched.password}
                    disabled={loading}
                    className="grow"
                  />
                </div>
                <div className="grow">
                  <TextField
                    type="password"
                    name="confirmPassword"
                    placeholder={'Confirm Password'}
                    value={formikProps.values.confirmPassword}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    error={formikProps.errors.confirmPassword}
                    touched={formikProps.errors.confirmPassword && formikProps.touched.confirmPassword}
                    disabled={loading}
                    className="grow"
                  />
                </div>
              </div>
              <Button type="submit" disabled={!(formikProps.isValid && formikProps.dirty) || loading} className="w-fit">
                Change password
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
