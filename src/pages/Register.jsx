import React, {useCallback, useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import StackTemplate from '../components/templates/StackTemplate';
import TextField from '../components/atoms/TextField';
import Button from '../components/atoms/Button';
import Link from '../components/atoms/Link';
import {createUser} from '../api/users';

import Logo from '../assets/images/logo.png';
import ChattingImage from '../assets/images/chatting.png';

/**
 * Application's register page.
 *
 * @return {JSX.Element} Register page
 */
export default function Register() {
  const schema = yup.object().shape({
    displayName: yup
      .string()
      .required('Is required')
      .max(150, 'Must be at most 50 characters')
      .min(4, 'Must be at least 4 characters'),
    email: yup.string().email('Must be a valid email').required('Is required'),
    password: yup.string().required('Is required'),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Is required'),
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Twaddle Web | Register';
  }, []);

  const onCreate = useCallback(
    async (values, {setFieldError, resetForm}) => {
      setLoading(true);
      setSuccess(null);
      setError(null);

      try {
        await createUser({
          displayName: values.displayName,
          email: values.email,
          password: values.password,
        });

        resetForm();
        setSuccess(
          'The user account has been created successfully. ' +
            'To activate the account, follow the instructions in the email that will be sent to you.',
        );
      } catch (err) {
        if (err.response && err.response.status === 422) {
          err.response.data.details?.forEach((detail) => setFieldError(detail.field, detail.message));
        } else {
          setError('An unexpected error occurred, please retry.');
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setSuccess],
  );

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center justify-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md">
          <div className="bg-sky-200 w-full h-[10rem] md:h-[12rem] rounded-t-md relative mb-[2.5rem]">
            <div className="flex space-x-6 justify-between p-8">
              <div className="whitespace-nowrap">
                <div className="text-sky-800 font-semibold md:text-lg">Welcome to Twaddle!</div>
                <div className="text-sky-800 md:text-lg">Create your account</div>
              </div>
              <div className="grow flex justify-end">
                <img className="w-auto max-h-[8rem] object-contain" src={ChattingImage} alt="Social Networking" />
              </div>
            </div>
            <div
              className={
                'absolute bg-slate-100 top-[7.5rem] md:top-[9.5rem] left-8 rounded-full ' + 'h-[5rem] w-[5rem] p-4'
              }
            >
              <img className="h-auto w-full" src={Logo} alt="Logo" />
            </div>
          </div>
          <div className="p-8 space-y-6">
            {success && <p className="text-center text-green-500">{success}</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <Formik
              initialValues={{
                displayName: '',
                email: '',
                password: '',
                passwordConfirmation: '',
              }}
              validationSchema={schema}
              onSubmit={onCreate}
            >
              {(formikProps) => (
                <form className="space-y-4" onSubmit={formikProps.handleSubmit} noValidate>
                  <div>
                    <TextField
                      name="displayName"
                      placeholder="Display Name"
                      label="Display Name"
                      disabled={loading}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      value={formikProps.values.displayName}
                      error={formikProps.errors.displayName}
                      touched={formikProps.errors.displayName && formikProps.touched.displayName}
                    />
                  </div>
                  <div>
                    <TextField
                      name="email"
                      type="email"
                      placeholder="E-Mail"
                      label="E-Mail"
                      disabled={loading}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      value={formikProps.values.email}
                      error={formikProps.errors.email}
                      touched={formikProps.errors.email && formikProps.touched.email}
                    />
                  </div>
                  <div>
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
                  <div>
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
                  <Button
                    type="submit"
                    disabled={!(formikProps.isValid && formikProps.dirty) || loading}
                    className="w-full flex justify-center"
                  >
                    {!loading && <span>Register</span>}
                    {loading && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
                  </Button>
                  <div className="text-xs text-center">
                    By clicking on &quot;Register&quot; you accept the <Link to="/terms-of-use">Terms of Use</Link> and
                    our <Link to="/privacy-policy">Privacy Policy</Link>.
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
        <div className="text-center">
          <Link className="!text-sm !text-gray-800 !dark:text-white" to="/login">
            Do you already have an account?
          </Link>
        </div>
      </div>
    </StackTemplate>
  );
}
