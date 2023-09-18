import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useGlobalContext } from '../../context';

const Confirmations = () => {
  const { confirmations, setConfirmations, setAffirm } = useGlobalContext();

  return confirmations?.isShow ? (
    <section id='confirm_sect'>
      <div className='center_sect'>
        <h3 className='heading'>
          Confirm
          <button
            className='close_btn'
            onClick={() =>
              setConfirmations &&
              setConfirmations({ isShow: false, msg: '', type: '' })
            }
          >
            <FaTimes />
          </button>
        </h3>

        <p className='question'>
          Are you sure you want to {confirmations?.msg}?
        </p>

        <div className='btns_wrapper'>
          <button
            className='act_btn yes_btn'
            onClick={() => {
              setAffirm && setAffirm({ state: true, type: confirmations.type });
              setConfirmations &&
                setConfirmations({ isShow: false, msg: '', type: '' });
            }}
          >
            Yes
          </button>
          <button
            className='act_btn no_btn'
            onClick={() =>
              setConfirmations &&
              setConfirmations({ isShow: false, msg: '', type: '' })
            }
          >
            No
          </button>
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default Confirmations;
