import React, {useCallback, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useNavigate} from 'react-router-dom';
import Button from '../../atoms/Button';
import TextField from '../../atoms/TextField';
import Avatar from '../../atoms/Avatar';
import {updateCurrentUser, getCurrentUser} from '../../../api/users';
import authSlice from '../../../store/slices/auth';

/**
 * Form for updating the public profile and account information of the currently logged in user.
 *
 * @return {JSX.Element} The form component
 */
export default function UpdateCurrentUserForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const principal = useSelector((state) => state.auth.principal);

  const schema = yup.object().shape({
    displayName: yup
      .string()
      .max(150, 'Must be at most 150 characters')
      .min(4, 'Must be at least 4 characters')
      .optional(),
    email: yup.string().email('Must be a valid email'),
    password: yup.string().optional(),
    passwordConfirmation: yup
      .string()
      .when('password', {
        is: (password) => password && password.length > 0,
        then: () =>
          yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Is required'),
        otherwise: () => yup.string().nullable(),
      })
      .optional(),
  });

  const onUpdate = useCallback(
    async (values, {setFieldError, resetForm}) => {
      setSuccess(null);
      setLoading(true);
      setError(null);

      try {
        await updateCurrentUser({
          displayName: values.displayName != '' ? values.displayName : undefined,
          email: values.email != '' ? values.email : undefined,
          password: values.password != '' ? values.password : undefined,
        });

        const userRes = await getCurrentUser();
        dispatch(authSlice.actions.setPrincipal(userRes.data));

        resetForm();
        setSuccess(true);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/logout');
        } else if (err.response && err.response.status === 422) {
          err.response.data.details?.forEach((detail) => setFieldError(detail.field, detail.message));
        } else {
          setError('An unexpected error occurred, please retry.');
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  return (
    <div className="text-gray-800 space-y-4">
      <div>
        <h2 className="text-2xl">Update your account</h2>
        <hr className="border-slate-300 mt-2" />
      </div>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="order-first lg:order-last mb-8 lg:ml-8 lg:mb-0">
          <div className="mb-1 text-sm">Profile image</div>
          <div className="bg-gray-200 text-gray-800 p-5 rounded-full w-fit relative">
            <div className="h-32 aspect-square rounded-md">
              <Avatar value={principal.displayName} />
            </div>
            <div className="absolute bottom-4 -right-4">
              <Button className="!text-xs flex justify-center items-center space-x-1">
                <FontAwesomeIcon icon={faPen} className="block h-3 w-3 text-gray-800" aria-hidden="true" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Formik
            initialValues={{
              displayName: '',
              email: '',
              password: '',
              passwordConfirmation: '',
            }}
            validationSchema={schema}
            onSubmit={onUpdate}
          >
            {(formikProps) => (
              <form className="space-y-4" onSubmit={formikProps.handleSubmit} noValidate>
                <div>
                  <TextField
                    name="displayName"
                    placeholder={principal?.displayName || 'Display Name'}
                    label="Display Name"
                    disabled={loading}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.displayName}
                    error={formikProps.errors.displayName}
                    touched={formikProps.errors.displayName && formikProps.touched.displayName}
                  />
                  <div className="text-xs mt-1">Your name will be shown to your contacts and chat partners.</div>
                </div>
                <div>
                  <TextField
                    name="email"
                    type="email"
                    placeholder={principal?.email || 'E-Mail'}
                    label="E-Mail"
                    disabled={loading}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.email}
                    error={formikProps.errors.email}
                    touched={formikProps.errors.email && formikProps.touched.email}
                  />
                  {formikProps.touched.email && (
                    <div className="text-xs mt-1">
                      Changing the e-mail requires a new validation of the e-mail address. Until then, functions may be
                      restricted again.
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
                  <div className="grow">
                    <TextField
                      name="password"
                      type="password"
                      placeholder="Password"
                      label="Password"
                      disabled={loading}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      value={formikProps.values.password}
                      error={formikProps.errors.password}
                      touched={formikProps.errors.password && formikProps.touched.password}
                    />
                  </div>
                  <div className="grow">
                    <TextField
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Confirm Password"
                      label="Confirm Password"
                      disabled={loading}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      value={formikProps.values.passwordConfirmation}
                      error={formikProps.errors.passwordConfirmation}
                      touched={formikProps.errors.passwordConfirmation && formikProps.touched.passwordConfirmation}
                    />
                  </div>
                </div>
                {error && <p className="text-left text-red-500">{error}</p>}
                {success && <p className="text-left text-green-600">The account information has been updated.</p>}
                <Button
                  type="submit"
                  disabled={!(formikProps.isValid && formikProps.dirty) || loading}
                  className="flex justify-center !text-green-600"
                >
                  {!loading && <span>Update account</span>}
                  {loading && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
