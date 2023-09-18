import { UserCredential } from 'firebase/auth';
import {
  EduJournServices,
  usersColRef,
} from './../../services/EduJournServices';
import { UserInfoInt } from './../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImg } from '../../helpers/firebaseFunctions';
import { DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import { userSlice } from './userSlice';

interface RegisterUserPayloadInt extends UserInfoInt {
  password: string;
}

const eduJournServices = new EduJournServices();

// *Register User
export const registerUser = createAsyncThunk<
  { userAlreadyAuth: boolean; userAlreadyReg: boolean },
  { data: RegisterUserPayloadInt; resetFields: () => void; isGoogle?: boolean }
>('user/regUser', async (payload, thunkApi) => {
  const {
    data: { email, password },
  } = payload;
  let userAlreadyAuth = payload.isGoogle ? false : true;
  let userAlreadyReg = true;

  try {
    if (payload.data.imgFile) {
      payload.data.imgUrl = await uploadImg(
        payload.data.imgFile,
        payload.data.id
      );
    }
    const userInfo = await eduJournServices.isUserRegistered(email); //* Checks if email is linked to any account
    if (!payload.isGoogle && !userInfo.size) {
      await eduJournServices.EPSignUp(email, password);
      await eduJournServices.logOut();
      userAlreadyAuth = false;
    }

    if (!userInfo.docs.find((doc) => doc.data().role === payload.data.role)) {
      await eduJournServices.setUserInfo(payload.data);
      userAlreadyReg = false;
    }
    payload.resetFields();
    return { userAlreadyAuth, userAlreadyReg };
  } catch (error) {
    return thunkApi.rejectWithValue(`Registration error: ${error}`);
  }
});

// *Google Signin
export const googleSignIn = createAsyncThunk<UserInfoInt | true, void>(
  'user/googleSignIn',
  async (payload, thunkApi) => {
    try {
      const result = await eduJournServices.googleSignIn();

      const userInfo = await eduJournServices.getLoggedInUserInfo(
        result.user.email as string,
        'author'
      );

      if (userInfo.size === 0) {
        sessionStorage.setItem('userRole', JSON.stringify('author'));
        return true;
      }
      sessionStorage.setItem('userRole', JSON.stringify('author'));
      return userInfo.docs[0].data() as UserInfoInt;
    } catch (error) {
      return thunkApi.rejectWithValue(`Google signin ${error}`);
    }
  }
);

// *Sigin User
export const signInUser = createAsyncThunk<
  UserInfoInt,
  { email: string; password: string; role: string }
>('user/signinUser', async (payload, thunkApi) => {
  try {
    await eduJournServices.EPSignIn(payload.email, payload.password);
    const userInfo = await eduJournServices.getLoggedInUserInfo(
      payload.email,
      payload.role
    );

    if (userInfo.size === 0) throw new Error('Account does not exist');
    sessionStorage.setItem('userRole', JSON.stringify(payload.role));
    return userInfo.docs[0].data() as UserInfoInt;
  } catch (error) {
    try {
      await eduJournServices.logOut();
    } catch (err) {
      console.log('Error loging out after failed login');
    }
    return thunkApi.rejectWithValue(`Signin ${error}`);
  }
});

// * Get User info
export const getUserInfo = createAsyncThunk<void, { email: string }>(
  'user/userInfo',
  async (payload, thunkApi) => {
    const { email } = payload;
    try {
      const role: string = sessionStorage.getItem('userRole')
        ? JSON.parse(sessionStorage.getItem('userRole') as string)
        : '';
      const snapQuery = query(
        usersColRef,
        where('email', '==', email),
        where('role', '==', role)
      );

      const { setUserDetails } = userSlice.actions;

      const unsub = onSnapshot(snapQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();

          thunkApi.dispatch(setUserDetails(userData));
        });
      });
    } catch (error) {
      return thunkApi.rejectWithValue(`User fetch ${error}`);
    }
  }
);

// * Update User Info
export const updateUserInfo = createAsyncThunk<
  void,
  {
    name: string;
    title: string;
    dept: string;
    affiliation: string;
    id: string;
  }
>('user/updateUserInfo', async (payload, thunkApi) => {
  try {
    await eduJournServices.updateUserInfo(payload);
  } catch (error) {
    thunkApi.rejectWithValue(`Info update ${error}`);
  }
});

// *Update Password
export const updatePassWord = createAsyncThunk<void, { password: string }>(
  'user/updatePassword',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.updateUserPassword(payload.password);
    } catch (error) {
      thunkApi.rejectWithValue(`Password update ${error}`);
    }
  }
);

// * Get Authors
export const getAuthors = createAsyncThunk<UserInfoInt[], void>(
  'user/getAuthors',
  async (payload, thunkApi) => {
    try {
      let allAuthors: UserInfoInt[] = [];
      const querySnapshot = await eduJournServices.getAuthors();
      querySnapshot.forEach((doc) => {
        allAuthors.push(doc.data() as UserInfoInt);
      });

      return allAuthors;
    } catch (error) {
      return thunkApi.rejectWithValue(`Getting all authors ${error}`);
    }
  }
);

// *Forgot Password
export const forgotPword = createAsyncThunk<void, { email: string }>(
  'user/forgotPword',
  async (payload, thunkApi) => {
    const { email } = payload;
    await eduJournServices.forgotPword(email);
    try {
    } catch (error) {
      return thunkApi.rejectWithValue(`Forgot password ${error}`);
    }
  }
);
