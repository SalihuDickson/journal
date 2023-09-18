import React, { useState, useRef, useEffect } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import {
  validateName,
  validateAffil,
  validateConPassword,
  validateDept,
  validateEmail,
  validatePassword,
  validateTitle,
} from '../../../helpers/formHandling';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { registerUser } from '../../../features/user/userAsyncThunk';
import { userSlice } from '../../../features/user/userSlice';

const AddTeam = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('default');
  const [picFile, setPicFile] = useState<File | null>(null);
  const [picUrl, setPicUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [conPassword, setConPassword] = useState('');
  const [password, setPassword] = useState('');
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const deptInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const conPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const affilInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();
  const { isSignedUp, isAddingTeam, isAlreadyReg, setIsLoggedInFalse } =
    useAppSelector((state) => state.user);
  const { setIsLoggedIn, resetSetIsLoggedInFalse } = userSlice.actions;

  const handlePicSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      validateName(name, nameInputRef.current) &&
      validateTitle(title, titleInputRef.current) &&
      validateEmail(email, emailInputRef.current) &&
      validateDept(dept, deptInputRef.current) &&
      validatePassword(password, passwordInputRef.current) &&
      validateConPassword(conPassword, password, conPasswordInputRef.current) &&
      validateAffil(affiliation, affilInputRef.current)
    ) {
      if (!role || role === 'default') {
        toast.error('Assign role!');
        return;
      }
      const data = {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        dept: dept.trim(),
        password,
        affiliation: affiliation.trim(),
        id: v4(),
        role,
        imgFile: picFile,
      };
      dispatch(registerUser({ data, resetFields }));
    }
  };

  const resetFields = () => {
    setName('');
    setTitle('');
    setEmail('');
    setDept('');
    setPassword('');
    setConPassword('');
    setPicFile(null);
    setAffiliation('');
    setRole('default');
  };

  useEffect(() => {
    if (isSignedUp && !isAlreadyReg) {
      toast.success('User added to Team', { toastId: 'login_toast' });
    }
  }, [isSignedUp, isAlreadyReg]);

  useEffect(() => {
    if (setIsLoggedIn) {
      setTimeout(() => {
        dispatch(setIsLoggedIn(!setIsLoggedInFalse));
        dispatch(resetSetIsLoggedInFalse(''));
      }, 3000);
    }
  }, [setIsLoggedInFalse]);

  return (
    <DashBoardOverlayLayout type='add to team'>
      <form action='' className='add_team_form' onSubmit={handleSubmit}>
        <div className='add_team_wrapper'>
          <div className='form_opt'>
            <input
              type='text'
              placeholder='Fullname (e.g Dr. John Doe)'
              onChange={(e) => setName(e.target.value)}
              value={name}
              ref={nameInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Academic title (e.g Professor)'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              ref={titleInputRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailInputRef}
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
              type={showPassword ? 'text' : 'password'}
              placeholder='Password (not less than 8 characters)'
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
              type={showConPassword ? 'text' : 'password'}
              placeholder='Confirm password'
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
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

          <div className='form_opt'>
            <input
              type='text'
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder='Affiliation'
              ref={affilInputRef}
            />
          </div>

          <div className='form_opt'>
            <select
              value={role}
              className='role_select'
              onChange={(e) => setRole(e.target.value)}
            >
              <option value='default' disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option value={role} key={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className='form_opt file_wrapper'>
            <label htmlFor='img_input'>Select Picture</label>
            <input
              type='file'
              accept='image/*'
              id='img_input'
              onChange={handlePicSelection}
            />
          </div>
        </div>
        <button
          className='submit_btn'
          disabled={isAddingTeam}
          style={isAddingTeam ? { opacity: '0.5', cursor: 'not-allowed' } : {}}
        >
          {isAddingTeam ? 'Adding...' : 'Add'}
        </button>
      </form>
    </DashBoardOverlayLayout>
  );
};

export default AddTeam;

const roles = ['editor', 'reviewer'];
