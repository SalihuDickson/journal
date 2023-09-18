import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context';
import { auth } from '../../services/firbase_config';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const [count, setCount] = useState(30);
  const {
    getVerificationLink,
    disableVerBtn,
    setDisableVerBtn,
    verErrorMsg,
    logOut,
    isLoggingOut,
    justLoggedOut,
  } = useGlobalContext();
  const { currentUser } = auth;

  const navigate = useNavigate();

  useEffect(() => {
    if (disableVerBtn && setDisableVerBtn) {
      let iniCount = count;
      const countDownInterval = setInterval(() => {
        iniCount--;
        if (iniCount !== 0) setCount(iniCount);
        else {
          clearInterval(countDownInterval);
          setDisableVerBtn(false);
        }
      }, 1000);
    }
  }, [disableVerBtn]);

  useEffect(() => {
    if (justLoggedOut) {
      navigate('/');
    }
  }, [justLoggedOut]);

  useEffect(() => {
    if (verErrorMsg?.includes('request'))
      toast.error('Too many frequent request made!');
  }, [verErrorMsg]);

  return (
    <div
      id='email_ver_sect'
      style={
        (currentUser && currentUser.emailVerified) || !currentUser
          ? { display: 'none' }
          : {}
      }
    >
      <div className='center_sect'>
        <h2>Verify Email</h2>
        <p>Verify Email to continue. This will not take long</p>
        <p>Please reload after verification</p>
        <div className='btns_wrapper'>
          <button
            className='ver_btn'
            onClick={() => getVerificationLink && getVerificationLink()}
            style={
              disableVerBtn ? { opacity: '0.5', cursor: 'not-allowed' } : {}
            }
            disabled={disableVerBtn}
          >
            {!disableVerBtn ? 'Verify' : `Resend ${count}s`}
          </button>
          <button
            className='logout_btn'
            onClick={() => logOut && logOut()}
            style={
              isLoggingOut ? { opacity: '0.5', cursor: 'not-allowed' } : {}
            }
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
