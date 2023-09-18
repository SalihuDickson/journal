import React, { useState, useRef, useEffect } from 'react';
import AuthFormsLayout from './layouts/AuthFormsLayout';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { regex } from '../data';
import { useAppDispatch, useAppSelector } from '../app/store';
import { registerUser } from '../features/user/userAsyncThunk';
import { v4 } from 'uuid';
import {
  validateName,
  validateAffil,
  validateConPassword,
  validateDept,
  validateEmail,
  validatePassword,
  validateTitle,
} from '../helpers/formHandling';
import { userSlice } from '../features/user/userSlice';

const AuthorSignUp = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const deptInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const conPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const affilInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();
  const {
    isSignedUp,
    userDetails,
    isLoggedIn,
    isJustLoggedIn,
    appError,
    setupAcct,
  } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const { setIsSignedUp, resetAuthError, setIsJustLoggedIn, resetSetupAcct } =
    userSlice.actions;

  const handleSignUpSubmit = (e: React.FormEvent) => {
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
      const data = {
        name,
        title,
        email: email.toLowerCase(),
        dept,
        password,
        affiliation,
        id: v4(),
        role: 'author',
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
    setAffiliation('');
  };

  useEffect(() => {
    if (isSignedUp) {
      toast.success('Signup success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [isSignedUp]);

  useEffect(() => {
    if (isJustLoggedIn && userDetails.id) {
      if (!setupAcct) navigate(`/submissions/author/${userDetails.id}`);
      dispatch(setIsJustLoggedIn(false));
    }
  }, [isJustLoggedIn, userDetails, setupAcct]);

  return (
    <AuthFormsLayout
      sectId='signup'
      sectTitle='Join up'
      submitText='Signup'
      handleSubmit={handleSignUpSubmit}
    >
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

      <div className='add_action_part'>
        <Link to='/login' className='bottom_part_btn'>
          Already have an account?
        </Link>
      </div>
    </AuthFormsLayout>
  );
};

export default AuthorSignUp;
