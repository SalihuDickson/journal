import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../context';
import { useAppDispatch, useAppSelector } from '../app/store';
import { articleSlice } from '../features/article/articleSlice';
import {
  updateStatus,
  // getVolumeCount,
  publishArticle,
} from '../features/article/articleAsyncuThunk';

const Dashboard = () => {
  const { userDetails, isLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { affirm, setAffirm } = useGlobalContext();
  const { allArticles, volCount } = useAppSelector((state) => state.article);
  const { setJustPublished, setIsPublishing } = articleSlice.actions;
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) navigate(`${userDetails.role}/${userDetails.id}`);
    else {
      toast.info('Login to access page', { toastId: 'login_toast' });
      navigate('/login');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (affirm?.state && affirm?.type === 'publish') {
      dispatch(setIsPublishing(true));
      const pendingArticles = allArticles.filter(
        (art) => art.status === 'pending'
      )!;

      pendingArticles.forEach((art) => {
        dispatch(publishArticle(art));
      });
      dispatch(setIsPublishing(false));
      dispatch(setJustPublished(true));
      setAffirm && setAffirm({ type: '', state: false });
    }
  }, [affirm, volCount]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default Dashboard;
