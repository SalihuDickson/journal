import React from 'react';
import { AiOutlineHome, AiOutlineArrowLeft } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { googleSignIn } from '../../features/user/userAsyncThunk';
import { EduJournServices } from '../../services/EduJournServices';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firbase_config';

interface AuthFormsLayoutPropInt {
  children: React.ReactNode;
  sectTitle: string;
  sectId: string;
  submitText: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  closeSect?: () => void;
}

const AuthFormsLayout: React.FC<AuthFormsLayoutPropInt> = ({
  children,
  sectTitle,
  sectId,
  submitText,
  handleSubmit,
  closeSect,
}) => {
  const { isSignupLoading, isLogInLoading, isRequesting } = useAppSelector(
    (state) => state.user
  );

  const dispatch = useAppDispatch();

  const handleGoogleSignup = async () => {
    dispatch(googleSignIn());
  };

  return (
    <section id={sectId} className='auth_sect'>
      <div className='auth_sect_wrapper'>
        <h3 className='auth_heading'>
          {sectTitle}
          {sectId === 'forgot' ? (
            <button
              className='redirect_btn'
              type='button'
              onClick={() => closeSect && closeSect()}
            >
              <AiOutlineArrowLeft />
            </button>
          ) : (
            <Link to='/' className='redirect_btn'>
              <AiOutlineHome />
            </Link>
          )}
        </h3>

        <form className='login_form auth_form' onSubmit={handleSubmit}>
          {children}
          <button
            className='auth_submit_btn'
            disabled={isSignupLoading || isLogInLoading || isRequesting}
            style={
              isSignupLoading || isLogInLoading || isRequesting
                ? { opacity: '0.5', cursor: 'not-allowed' }
                : {}
            }
          >
            {isSignupLoading || isLogInLoading || isRequesting
              ? submitText === 'Signup'
                ? 'Siging up...'
                : submitText === 'Request'
                ? 'Requesting...'
                : 'Loging in...'
              : submitText}
          </button>
        </form>

        {sectId === 'signup' && (
          <>
            <p className='some_text'>
              <span>or login with</span>
            </p>

            <button
              className='opt_btn'
              disabled={isSignupLoading || isLogInLoading}
              style={
                isSignupLoading || isLogInLoading ? { opacity: '0.5' } : {}
              }
              onClick={handleGoogleSignup}
            >
              <span>G</span>oogle
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default AuthFormsLayout;
