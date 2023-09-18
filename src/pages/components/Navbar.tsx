import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { navLinks } from '../../data';
import { userSlice } from '../../features/user/userSlice';
import { useAppSelector } from '../../app/store';
import { useGlobalContext } from '../../context';

const Navbar = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { logOut } = useGlobalContext();
  return (
    <nav id='nav_sect'>
      <div className='center_sect'>
        <Link to='/' className='logo_btn'>
          E<span>J</span>
        </Link>

        <div className='nav_link_wrapper'>
          {navLinks.map(({ url, title }, index) => (
            <NavLink
              key={index}
              to={url}
              className={`nav_link ${
                title === 'Login/Signup' ? 'login_btn' : ''
              }`}
            >
              {title}
            </NavLink>
          ))}

          <NavLink
            to={isLoggedIn ? '/' : '/login'}
            className={`nav_link ${isLoggedIn ? 'logout_btn' : 'login_btn'}`}
            onClick={isLoggedIn ? () => logOut && logOut() : () => {}}
          >
            {isLoggedIn ? 'Logout' : 'Login/Signup'}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
