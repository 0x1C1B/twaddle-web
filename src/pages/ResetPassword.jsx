import React, {useCallback, useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useSearchParams} from 'react-router-dom';
import {sendPasswordResetMail, resetPassword} from '../api/users';
import StackTemplate from '../components/templates/StackTemplate';
import TextField from '../components/atoms/TextField';
import Button from '../components/atoms/Button';
import Link from '../components/atoms/Link';

import Logo from '../assets/images/logo.png';
import ForgotPasswordImage from '../assets/images/forgot-password.png';

/**
 * Page component for resetting a user's password.
 *
 * @return {JSX.Element} Page component for resetting a user's password
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Twaddle Web | Reset Password';
  }, []);

  const onRequestResetEmail = useCallback(
    async (values, {setFieldError, resetForm}) => {
      setLoading(true);
      setSuccess(null);
      setError(null);

      try {
        resetForm();
        await sendPasswordResetMail(values.email);
        setSuccess('The password reset email has been sent successfully if the user exists. Please check your inbox.');
      } catch (err) {
        if (err.response && err.response.status === 422) {
          err.response.data.details?.forEach((detail) => setFieldError(detail.field, detail.message));
        } else if (err.response && err.response.status === 404) {
          setError('The user does not exist.');
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

  const onResetPassword = useCallback(
    async (values, {setFieldError, resetForm}) => {
      setLoading(true);
      setSuccess(null);
      setError(null);

      try {
        resetForm();
        await resetPassword({
          password: values.password,
          resetToken: searchParams.get('token'),
        });
        setSuccess('The password has been reset successfully. You can now login.');
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
    [searchParams, setLoading, setError, setSuccess],
  );

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center justify-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md">
          <div className="bg-sky-200 w-full h-[10rem] md:h-[12rem] rounded-t-md relative mb-[2.5rem]">
            <div className="flex space-x-6 justify-between p-8">
              <div className="whitespace-nowrap">
                <div className="text-sky-800 font-semibold md:text-lg">Forgot your password?</div>
                <div className="text-sky-800 md:text-lg">Don&apos;t worry</div>
              </div>
              <div className="grow flex justify-end">
                <img className="w-auto max-h-[8rem] object-contain" src={ForgotPasswordImage} alt="Social Networking" />
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
            {success && <p className="text-center text-green-600">{success}</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {searchParams.get('token') ? (
              <div className="space-y-6">
                <p>Use the form below to choose a new password.</p>
                <Formik
                  initialValues={{
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={yup.object().shape({
                    password: yup.string().required('Is required'),
                    passwordConfirmation: yup
                      .string()
                      .oneOf([yup.ref('password')], 'Passwords must match')
                      .required('Is required'),
                  })}
                  onSubmit={onResetPassword}
                >
                  {(formikProps) => (
                    <form className="space-y-4" onSubmit={formikProps.handleSubmit} noValidate>
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
                        className="w-full flex justify-center !bg-sky-500 focus:!outline-sky-500 !text-white"
                      >
                        {!loading && <span>Reset Pasword</span>}
                        {loading && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
                      </Button>
                    </form>
                  )}
                </Formik>
                <div className="text-center">
                  <Link className="!text-sm" to="/login">
                    Back to Login.
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p>Enter your email address below and we will send you a link to reset your password.</p>
                <Formik
                  initialValues={{
                    email: '',
                  }}
                  validationSchema={yup.object().shape({
                    email: yup.string().email('Must be a valid email').required('Is required'),
                  })}
                  onSubmit={onRequestResetEmail}
                >
                  {(formikProps) => (
                    <form className="space-y-4" onSubmit={formikProps.handleSubmit} noValidate>
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
                      <Button
                        type="submit"
                        disabled={!(formikProps.isValid && formikProps.dirty) || loading}
                        className="w-full flex justify-center !bg-sky-500 focus:!outline-sky-500 !text-white"
                      >
                        {!loading && <span>Send E-Mail</span>}
                        {loading && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
                      </Button>
                    </form>
                  )}
                </Formik>
                <div className="text-center">
                  <Link className="!text-sm">Resend email with verification token.</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
