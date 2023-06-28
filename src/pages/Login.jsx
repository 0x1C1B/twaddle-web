import React, {useCallback, useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import StackTemplate from '../components/templates/StackTemplate';
import TextField from '../components/atoms/TextField';
import Button from '../components/atoms/Button';
import Link from '../components/atoms/Link';

import Logo from '../assets/images/logo.png';

/**
 * The login page of the application.
 *
 * @return {JSX.Element} Application's login page component
 */
export default function Login() {
  const [error] = useState(null);
  const [loading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email('Must be a valid email').required('Is required'),
    password: yup.string().required('Is required'),
  });

  useEffect(() => {
    document.title = 'Twaddle Web | Login';
  }, []);

  const onLogin = useCallback(async (values) => {}, []);

  return (
    <StackTemplate>
      <div className={'h-full bg-gray-50 text-gray-800 flex flex-col items-center justify-center px-4 py-12 space-y-4'}>
        <div className="w-full max-w-xl bg-white text-gray-800 shadow-md rounded-md p-8 space-y-6">
          <div>
            <img className="mx-auto h-10 md:h-12 lg:h-14 w-auto" src={Logo} alt="Logo" />
            <h1 className="mt-4 text-center lg:text-3xl text-2xl font-bold">Login into your account</h1>
          </div>
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
        <div className="text-center">
          <Link className="!text-sm !text-gray-800 !dark:text-white" to="/register">
            Do you have no account?
          </Link>
        </div>
      </div>
    </StackTemplate>
  );
}
