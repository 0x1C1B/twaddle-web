import React, {useCallback, useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {generateToken} from '../api/auth';
import {getCurrentUser} from '../api/users';
import authSlice from '../store/slices/auth';
import StackTemplate from '../components/templates/StackTemplate';
import TextField from '../components/atoms/TextField';
import Button from '../components/atoms/Button';
import Link from '../components/atoms/Link';

import Logo from '../assets/images/logo.png';
import SocialNetworkingImage from '../assets/images/social-networking.png';

/**
 * The login page of the application.
 *
 * @return {JSX.Element} Application's login page component
 */
export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    email: yup.string().email('Must be a valid email').required('Is required'),
    password: yup.string().required('Is required'),
  });

  useEffect(() => {
    document.title = 'Twaddle Web | Login';
  }, []);

  const onLogin = useCallback(async (values) => {
    setLoading(true);
    setError(null);

    try {
      const tokenRes = await generateToken(values.email, values.password);

      dispatch(
        authSlice.actions.setToken({
          accessToken: tokenRes.data.accessToken,
          accessExpiresIn: tokenRes.data.accessExpiresIn,
          refreshToken: tokenRes.data.refreshToken,
          refreshExpiresIn: tokenRes.data.refreshExpiresIn,
        }),
      );

      const userRes = await getCurrentUser();

      dispatch(authSlice.actions.setPrincipal(userRes.data));

      navigate('/home');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Either username or password are wrong.');
      } else {
        setError('An unexpected error occurred, please retry.');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <StackTemplate>
      <div
        className={'h-full bg-slate-50 text-slate-800 flex flex-col items-center justify-center px-4 py-12 space-y-4'}
      >
        <div className="w-full max-w-xl bg-white text-slate-800 shadow-md rounded-md">
          <div className="bg-sky-200 w-full h-[10rem] md:h-[12rem] rounded-t-md relative mb-[2.5rem]">
            <div className="flex space-x-6 justify-between p-8">
              <div className="whitespace-nowrap">
                <div className="text-sky-800 font-semibold md:text-lg">Welcome back!</div>
                <div className="text-sky-800 md:text-lg">Log in to continue</div>
              </div>
              <div className="grow flex justify-end">
                <img
                  className="w-auto max-h-[8rem] object-contain"
                  src={SocialNetworkingImage}
                  alt="Social Networking"
                />
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
            {error && <p className="text-center text-red-500">{error}</p>}
            <Formik initialValues={{email: '', password: ''}} validationSchema={schema} onSubmit={onLogin}>
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
                  <Button
                    type="submit"
                    disabled={!(formikProps.isValid && formikProps.dirty) || loading}
                    className="w-full flex justify-center"
                  >
                    {!loading && <span>Login</span>}
                    {loading && <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />}
                  </Button>
                </form>
              )}
            </Formik>
            <div className="text-center">
              <Link className="!text-sm" to="/reset-password">
                Do you forgot your password?
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link className="!text-sm !text-gray-800 !dark:text-white" to="/register">
            Do you have no account?
          </Link>
        </div>
      </div>
    </StackTemplate>
  );
}
