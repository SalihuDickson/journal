import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import userReducer from '../features/user/userSlice';
import articleReducer from '../features/article/articleSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    article: articleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
