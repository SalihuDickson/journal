import React, { useState, useRef, useEffect } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { validateName, validatePassword } from '../../../helpers/formHandling';
import { validateTitle } from '../../../helpers/formHandling';
import { validateDept } from '../../../helpers/formHandling';
import { validateAffil } from '../../../helpers/formHandling';
import {
  updatePassWord,
  updateUserInfo,
} from '../../../features/user/userAsyncThunk';
import { userSlice } from '../../../features/user/userSlice';
import { toast } from 'react-toastify';
import { validateConPassword } from '../../../helpers/formHandling';

const Settings = () => {
  const {
    userDetails,
    justUpdatedInfo,
    updatingFailed,
    justUpdatePassword,
    updatingPasswordFailed,
    updatingInfo,
    updatingPassword,
  } = useAppSelector((state) => state.user);
  const {
    resetJustUpdated,
    resetUpdatingFailed,
    resetUpdatingPasswordFailed,
    resetJustUpdatePassword,
  } = userSlice.actions;
  const dispatch = useAppDispatch();

  const [name, setName] = useState(userDetails.name);
  const [title, setTitle] = useState(userDetails.title);
  const [dept, setDept] = useState(userDetails.dept);
  const [affil, setAffil] = useState(userDetails.affiliation);
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const deptInputRef = useRef<HTMLInputElement | null>(null);
  const affilInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const conPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password) {
      if (
        validatePassword(password, passwordInputRef.current) &&
        validateConPassword(conPassword, password, conPasswordInputRef.current)
      ) {
        dispatch(updatePassWord({ password }));

        if (
          validateName(name, nameInputRef.current) &&
          validateTitle(title, titleInputRef.current) &&
          validateDept(dept, deptInputRef.current) &&
          validateAffil(affil, affilInputRef.current)
        ) {
          const data = {
            name,
            title,
            dept,
            affiliation: affil,
            id: userDetails.id,
          };

          dispatch(updateUserInfo(data));
          setUpdateLoading(false);
        }
      }
    } else if (
      validateName(name, nameInputRef.current) &&
      validateTitle(title, titleInputRef.current) &&
      validateDept(dept, deptInputRef.current) &&
      validateAffil(affil, affilInputRef.current)
    ) {
      const data = {
        name,
        title,
        dept,
        affiliation: affil,
        id: userDetails.id,
      };

      dispatch(updateUserInfo(data));
    }
  };

  useEffect(() => {
    if (justUpdatedInfo) {
      toast.success('Info updated');
      dispatch(resetJustUpdated(''));
    }

    if (updatingFailed) {
      toast.error('Updating failed');
      dispatch(resetUpdatingFailed(''));
    }

    if (justUpdatePassword) {
      toast.success('Password changed');
      dispatch(resetJustUpdatePassword(''));
    }

    if (updatingPasswordFailed) {
      toast.error('Password changing failed');
      dispatch(resetUpdatingPasswordFailed(''));
    }
  }, [
    justUpdatedInfo,
    updatingFailed,
    justUpdatePassword,
    updatingPasswordFailed,
  ]);

  return (
    <DashBoardOverlayLayout type='edit profile'>
      <form className='settings_form' onSubmit={handleSubmit}>
        <div className='settings_form_wrapper'>
          <div className='form_opt'>
            <input
              type='text'
              placeholder='Name (e.g Prof. Jane Doe)'
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={nameInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='
          Academic title (e.g Assistant Professor)'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Department'
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              ref={deptInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Affiliation'
              value={affil}
              onChange={(e) => setAffil(e.target.value)}
              ref={affilInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='New password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordInputRef}
            />
            <button
              className='pword_visible_toggle'
              onClick={() => setShowPassword(!showPassword)}
              type='button'
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <div className='form_opt'>
            <input
              placeholder='Confirm new password'
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
              type={showConPassword ? 'text' : 'password'}
              ref={conPasswordInputRef}
            />
            <button
              className='pword_visible_toggle'
              onClick={() => setShowConPassword(!showConPassword)}
              type='button'
            >
              {showConPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>
        <button
          className='submit_btn'
          style={
            updatingPassword || updatingInfo
              ? { opacity: '0.5', cursor: 'not-allowed' }
              : {}
          }
        >
          {updatingPassword || updatingInfo ? 'Updating...' : 'Update'}
        </button>
      </form>
    </DashBoardOverlayLayout>
  );
};

export default Settings;
