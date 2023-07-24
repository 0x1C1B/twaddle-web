import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import DeleteCurrentUserDialog from './DeleteCurrentUserDialog';
import Button from '../../atoms/Button';

/**
 * Application form for deleting the current user.
 *
 * @return {JSX.Element} The form component
 */
export default function DeleteCurrentUserForm() {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="text-gray-800 dark:text-white space-y-4">
      <div>
        <h2 className="text-2xl text-red-500">Delete your account</h2>
        <hr className="border-red-500 mt-2" />
      </div>
      <p>
        Here you can delete your account. Once you delete your account, there is no going back. All account-specific
        information and data will be irrevocably deleted. Please be certain.
      </p>
      <div className="w-full">
        <DeleteCurrentUserDialog
          onSubmit={() => {
            setShowDeleteModal(false);
            navigate('/logout');
          }}
          onClose={() => setShowDeleteModal(false)}
          isOpen={showDeleteModal}
        />
        <Button type="button" className="!text-red-500" onClick={() => setShowDeleteModal(true)}>
          Delete your account
        </Button>
      </div>
    </div>
  );
}
