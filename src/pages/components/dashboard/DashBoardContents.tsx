import React, { useEffect, useState } from 'react';
import { articleSlice } from '../../../features/article/articleSlice';
import { useGlobalContext } from '../../../context';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../../services/firbase_config';
import { v4 } from 'uuid';
import {
  ArticleInfoInt,
  CommentInt,
  MailEnum,
  StatusEnum,
  VerUrlsInt,
} from '../../../types';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import ShortUniqueId from 'short-unique-id';
import { toast } from 'react-toastify';
import {
  delArticle,
  updateStatus,
} from '../../../features/article/articleAsyncuThunk';

interface DashBoardContentsInt {
  article: ArticleInfoInt;
}

enum RoleClassEnum {
  auth = 'author_opt',
  rev = 'rev_opt',
  edi = 'editor_opt',
  adm = 'admin_opt',
}

const DashBoardContents: React.FC<DashBoardContentsInt> = ({ article }) => {
  const uid = new ShortUniqueId({ length: 7 });

  const {
    setCommentArticleId,
    setStatusArticleId,
    setVersionArticleId,
    setReviewersArticleId,
    setEditorsArticleId,
    setSendMail,
    setIsReload,
    setAuthorsArticleId,
    setConfirmations,
    affirm,
    setAffirm,
  } = useGlobalContext();
  const { isLoggedIn, userDetails } = useAppSelector((state) => state.user);
  const { isDeleting, isDeletingFailed, justDeleted } = useAppSelector(
    (state) => state.article
  );
  const {
    setAuthorComments,
    setReviewersComments,
    setEditorsComments,
    setVersions,
    setInitialLoading,
    resetIsDeletingFailed,
    resetJustDeleted,
  } = articleSlice.actions;
  const dispatch = useAppDispatch();
  const reference: string = uid();

  const paystackConfig: PaystackProps = {
    email: userDetails.email,
    amount: 10000,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ?? '',
    reference,
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = () => {
    dispatch(
      updateStatus({
        status: 'pending',
        articleId: article.id ?? '',
      })
    );

    toast.success('Payment successful');

    setSendMail &&
      setSendMail({
        state: true,
        type: MailEnum.pubArt,
        id: article.id ?? '',
        refId: reference,
      });
  };

  // you can call this function anything
  const onClose = () => {
    toast.info('Payment canceled');
  };

  const handleDelClick = () => {
    setConfirmations &&
      setConfirmations({
        isShow: true,
        msg: 'delete article',
        type: `delete_${article.id}`,
      });
  };

  const handlePublishClick = () => {
    initializePayment(onSuccess, onClose);
  };

  const [roleClass, setRoleClass] = useState<RoleClassEnum>(RoleClassEnum.auth);

  const authorCommentQuery = query(
    collection(db, `articles/${article.id}/comments/${article.id}/author`),
    orderBy('timestamp', 'asc')
  );

  const reviewersCommentQuery = query(
    collection(db, `articles/${article.id}/comments/${article.id}/reviewers`),
    orderBy('timestamp', 'asc')
  );

  const editorsCommentQuery = query(
    collection(db, `articles/${article.id}/comments/${article.id}/editors`),
    orderBy('timestamp', 'asc')
  );

  const fileVersionQuery = query(
    collection(db, `articles/${article.id}/versions`),
    orderBy('timestamp', 'desc')
  );

  const authorComments = () =>
    onSnapshot(authorCommentQuery, (querySnapshot) => {
      let comments: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();

        comments.push({
          ...commentData,
          timestamp: commentData.timestamp
            ? commentData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setAuthorComments({
          id: article.id,
          newComments: comments as CommentInt[],
          role: userDetails.role,
        })
      );
    });

  const reviewersComment = () =>
    onSnapshot(reviewersCommentQuery, (querySnapshot) => {
      let comments: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        comments.push({
          ...commentData,
          timestamp: commentData.timestamp
            ? commentData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setReviewersComments({
          id: article.id,
          newComments: comments as CommentInt[],
          role: userDetails.role,
        })
      );
    });

  const editorsComment = () =>
    onSnapshot(editorsCommentQuery, (querySnapshot) => {
      let comments: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        comments.push({
          ...commentData,
          timestamp: commentData.timestamp
            ? commentData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setEditorsComments({
          id: article.id,
          newComments: comments as CommentInt[],
          role: userDetails.role,
        })
      );
    });

  const fileVersion = () =>
    onSnapshot(fileVersionQuery, (querySnapshot) => {
      let versions: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const verData = doc.data();
        versions.push({
          ...verData,
          timestamp: verData.timestamp
            ? verData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setVersions({
          id: article.id,
          versions: versions as VerUrlsInt[],
          role: userDetails.role,
        })
      );
    });

  useEffect(() => {
    let unsubAuth: () => void;
    let unsubRev: () => void;
    let unsubEd: () => void;
    let unsubVer: () => void;
    if (isLoggedIn) {
      unsubVer = fileVersion();

      switch (userDetails.role) {
        case 'author':
          unsubAuth = authorComments();
          dispatch(setInitialLoading(false));
          break;

        case 'reviewer':
          unsubRev = reviewersComment();
          dispatch(setInitialLoading(false));

          break;

        case 'editor':
        case 'admin':
          unsubAuth = authorComments();
          unsubRev = reviewersComment();
          unsubEd = editorsComment();
          dispatch(setInitialLoading(false));

          break;

        default:
          return;
      }
    }

    return () => {
      unsubAuth?.();
      unsubRev?.();
      unsubEd?.();
      unsubVer?.();
    };
  }, [isLoggedIn, userDetails]);

  useEffect(() => {
    switch (userDetails.role) {
      case 'author':
        setRoleClass(RoleClassEnum.auth);
        break;

      case 'reviewer':
        setRoleClass(RoleClassEnum.rev);
        break;

      case 'editor':
        setRoleClass(RoleClassEnum.edi);
        break;

      case 'admin':
        setRoleClass(RoleClassEnum.adm);
        break;

      default:
        return;
    }
  }, [userDetails]);

  useEffect(() => {
    if (justDeleted) {
      toast.success('Article deleted', { toastId: 'del_toast' });
      dispatch(resetJustDeleted(''));
    }

    if (isDeletingFailed) {
      toast.error('Deleting failed', { toastId: 'del_toast' });
      dispatch(resetIsDeletingFailed(''));
    }
  }, [justDeleted, isDeletingFailed]);

  useEffect(() => {
    if (affirm) {
      const id = affirm.type.split('_')[1];
      if (affirm.type.includes('delete') && article.id === id) {
        dispatch(delArticle(id));
        setAffirm && setAffirm({ state: false, type: '' });
      }
    }
  }, [affirm, setAffirm]);

  return (
    <>
      <div
        className={`main_opt ${roleClass} ${article.status}_super_wrapper`}
        key={v4()}
        style={isDeleting ? { opacity: '0.5', pointerEvents: 'none' } : {}}
      >
        <div className='id_col col'>{article.id}</div>
        <div className='title_col col'>{article.title}</div>
        <div className='categ_col col'>
          {article.category}

          {userDetails.role === 'admin' &&
            article.status === StatusEnum.rej && (
              <button className='del_btn' onClick={handleDelClick}>
                Delete
              </button>
            )}
        </div>

        {userDetails.role !== 'reviewer' && (
          <button
            className={`status_col col ${
              (userDetails.role === 'editor' || userDetails.role === 'admin') &&
              article.status !== 'published' &&
              article.status !== 'approved' &&
              article.status !== 'pending'
                ? 'hover'
                : article.status === 'approved' && userDetails.role === 'admin'
                ? 'hover'
                : ''
            } ${article.status}`}
            onClick={
              (userDetails.role === 'editor' || userDetails.role === 'admin') &&
              article.status !== 'published' &&
              article.status !== 'approved' &&
              article.status !== 'pending'
                ? () => setStatusArticleId && setStatusArticleId(article.id)
                : article.status === 'approved' && userDetails.role === 'admin'
                ? () => setStatusArticleId && setStatusArticleId(article.id)
                : () => {}
            }
          >
            <span>
              {article.status}
              {userDetails.role === 'author' &&
                article.status === StatusEnum.app && (
                  <button className='publish_btn' onClick={handlePublishClick}>
                    Publish
                  </button>
                )}
            </span>
          </button>
        )}

        <button
          className='comment_col col hover'
          onClick={() =>
            setCommentArticleId ? setCommentArticleId(article.id) : ''
          }
          style={!article.comments ? { pointerEvents: 'none' } : {}}
        >
          {!article.comments
            ? 'Loading...'
            : `${
                userDetails.role === 'author'
                  ? article.comments.author?.length
                  : userDetails.role === 'reviewer'
                  ? article.comments.reviewers?.length
                  : userDetails.role === 'editor'
                  ? article.comments.author?.length +
                    article.comments.reviewers?.length
                  : article.comments.author?.length +
                    article.comments.reviewers?.length +
                    article.comments.editors?.length
              }`}
        </button>

        <button
          className='ver_col col hover'
          onClick={() => setVersionArticleId && setVersionArticleId(article.id)}
          style={!article.verUrls ? { pointerEvents: 'none' } : {}}
        >
          {!article.verUrls ? 'Loading...' : article.verUrls?.length}
        </button>

        {(userDetails.role === 'admin' || userDetails.role === 'editor') && (
          <button
            className={`rev_col col ${
              userDetails.role === 'editor' || userDetails.role === 'admin'
                ? 'hover'
                : ''
            }`}
            onClick={() =>
              setReviewersArticleId && setReviewersArticleId(article.id)
            }
          >
            {article.assReviewers?.length}
          </button>
        )}

        {userDetails.role === 'admin' && (
          <button
            className={`edi_col col ${
              userDetails.role === 'admin' ? 'hover' : ''
            }`}
            onClick={() =>
              setEditorsArticleId && setEditorsArticleId(article.id)
            }
          >
            {article.assEditors?.length}
          </button>
        )}

        {(userDetails.role === 'admin' || userDetails.role === 'editor') && (
          <button
            className={`auth_col col ${
              userDetails.role === 'editor' || userDetails.role === 'admin'
                ? 'hover'
                : ''
            }`}
            onClick={() =>
              setAuthorsArticleId && setAuthorsArticleId(article.id)
            }
          >
            {article.coAuthors?.length + 1}
          </button>
        )}
      </div>
    </>
  );
};

export default DashBoardContents;
