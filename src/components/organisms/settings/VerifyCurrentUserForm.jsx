import React, {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Button from '../../atoms/Button';
import {sendUserVerificationMail} from '../../../api/users';

/**
 * Specific form for requesting a user verification email and viewing the verification status.
 *
 * @return {JSX.Element} The form component
 */
export default function VerifyCurrentUserForm() {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const principal = useSelector((state) => state.auth.principal);

  const onSendVerificationMail = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendUserVerificationMail(principal.email);
      setSuccess(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/logout');
      } else if (err.response && err.response.status === 400) {
        setError('The user is probably already verified.');
      } else {
        setError('An unexpected error occurred, please retry.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, principal]);

  return (
    <div className="text-gray-800 space-y-4">
      <div>
        <h2 className="text-2xl">Verify your account</h2>
        <hr className="border-slate-300 mt-2" />
      </div>
      <p>
        Your account is not verified at the moment. In order to be able to use the full range of functions of the
        application, you must verify your account. An e-mail with an activation link will be sent to you for this
        purpose.
      </p>
      {error && <p className="text-left text-red-500">{error}</p>}
      {success && (
        <p className="text-left text-green-600">
          An email has been sent to you. Please check your inbox and click on the link in the email to verify your
          account.
        </p>
      )}
      <Button disabled={loading} onClick={onSendVerificationMail}>
        Send verification email
      </Button>
    </div>
  );
}
