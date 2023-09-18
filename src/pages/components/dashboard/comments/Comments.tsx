import React, { useRef, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/store';
import { useGlobalContext } from '../../../../context';
import { v4 } from 'uuid';
import DashBoardOverlayLayout from '../../../layouts/DashBoardOverlayLayout';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import AdminEditorComment from './AdminEditorComment';
import { articleSlice } from '../../../../features/article/articleSlice';
import { serverTimestamp } from 'firebase/firestore';
import { sendComment } from '../../../../features/article/articleAsyncuThunk';
import { toast } from 'react-toastify';
import {
  ArticleInfoInt,
  SendCommentInt,
  StatusEnum,
  TargetEnum,
} from '../../../../types';
import { timeConverter } from '../../../../helpers/timeConverter';

// TODO Fix comment height and add overflow when it reaches a certain height
// TODO When new comment comes in our user enters comments, scroll to the bottom of the comments

const Comments = () => {
  const { userDetails } = useAppSelector((state) => state.user);
  const {
    authorArticles,
    reviewerArticles,
    editorArticles,
    allArticles,
    isSendingComment,
  } = useAppSelector((state) => state.article);
  const { commentArticleId, setCommentArticleId } = useGlobalContext();
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const [displayArticle, setDisplayArticle] = useState<ArticleInfoInt | null>(
    null
  );

  const handleSubmit = (target: TargetEnum) => {
    if (message) {
      // * If name contains more than 3 words, pick the 2nd
      // * else pick the
      const name =
        userDetails.name.split(' ').length > 2
          ? userDetails.name.split(' ')[1]
          : userDetails.name.split(' ')[userDetails.name.split(' ').length - 1];

      const data: SendCommentInt = {
        senderId: userDetails.id,
        timestamp: serverTimestamp(),
        message,
        name,
        readers: [userDetails.id],
      };

      try {
        dispatch(
          sendComment({
            articleId: commentArticleId ?? '',
            data,
            target,
          })
        );
        setMessage('');
      } catch (err) {
        toast.error('Message not sent');
      }
    }
  };

  useEffect(() => {
    if (commentArticleId) {
      switch (userDetails.role) {
        case 'author':
          setDisplayArticle(
            authorArticles.find((article) => article.id === commentArticleId) ??
              null
          );
          break;

        case 'reviewer':
          setDisplayArticle(
            reviewerArticles.find(
              (article) => article.id === commentArticleId
            ) ?? null
          );
          break;

        case 'editor':
          setDisplayArticle(
            editorArticles.find((article) => article.id === commentArticleId) ??
              null
          );
          break;

        default:
          setDisplayArticle(
            allArticles.find((article) => article.id === commentArticleId) ??
              null
          );
          return;
      }
    }
  }, [
    userDetails,
    authorArticles,
    editorArticles,
    reviewerArticles,
    allArticles,
    commentArticleId,
  ]);

  return (
    <DashBoardOverlayLayout type='comment'>
      <>
        {userDetails.role === 'author' ? (
          <div className='comments'>
            {authorArticles
              .find((art) => art.id === commentArticleId)
              ?.comments.author.map((comment) => {
                const commentTime = timeConverter(comment.timestamp);
                return (
                  <article
                    key={v4()}
                    className={`comment ${
                      comment.senderId === userDetails.id ? 'my_msg' : ''
                    }`}
                  >
                    <p className='msg_wrapper'>{comment.message}</p>
                    <div className='footer'>
                      <span className='msg_sender'>
                        {comment.senderId === userDetails.id
                          ? 'Me'
                          : comment.name}
                      </span>

                      <span className='msg_time'>
                        <span className='date_wrapper'>
                          {commentTime.getDate()} /{' '}
                          {String(commentTime.getMonth()).length < 2
                            ? `0${commentTime.getMonth()}`
                            : commentTime.getMonth()}{' '}
                          / {String(commentTime.getFullYear()).slice(2)}
                        </span>

                        <span className='time_wrapper'>
                          {String(commentTime.getHours()).length < 2
                            ? `0${commentTime.getHours()}`
                            : commentTime.getHours()}{' '}
                          :{' '}
                          {String(commentTime.getMinutes()).length < 2
                            ? `0${commentTime.getMinutes()}`
                            : commentTime.getMinutes()}
                        </span>
                      </span>
                    </div>
                  </article>
                );
              })}
          </div>
        ) : userDetails.role === 'reviewer' ? (
          <div className='comments'>
            {reviewerArticles
              .find((art) => art.id === commentArticleId)
              ?.comments.reviewers.map((comment) => {
                const commentTime = timeConverter(comment.timestamp);
                return (
                  <article
                    key={v4()}
                    className={`comment ${
                      comment.senderId === userDetails.id ? 'my_msg' : ''
                    }`}
                  >
                    <p className='msg_wrapper'>{comment.message}</p>
                    <div className='footer'>
                      <span className='msg_sender'>
                        {comment.senderId === userDetails.id
                          ? 'Me'
                          : comment.name}
                      </span>
                      <span className='msg_time'>
                        <span className='date_wrapper'>
                          {commentTime.getDate()} /{' '}
                          {String(commentTime.getMonth()).length < 2
                            ? `0${commentTime.getMonth()}`
                            : commentTime.getMonth()}{' '}
                          / {String(commentTime.getFullYear()).slice(2)}
                        </span>

                        <span className='time_wrapper'>
                          {String(commentTime.getHours()).length < 2
                            ? `0${commentTime.getHours()}`
                            : commentTime.getHours()}{' '}
                          :{' '}
                          {String(commentTime.getMinutes()).length < 2
                            ? `0${commentTime.getMinutes()}`
                            : commentTime.getMinutes()}
                        </span>
                      </span>
                    </div>
                  </article>
                );
              })}
          </div>
        ) : userDetails.role === 'editor' ? (
          <AdminEditorComment
            comments={
              editorArticles.find((art) => art.id === commentArticleId)!
                .comments
            }
          />
        ) : userDetails.role === 'admin' ? (
          <AdminEditorComment
            comments={
              allArticles.find((art) => art.id === commentArticleId)!.comments
            }
          />
        ) : (
          <></>
        )}

        <textarea
          placeholder='Enter message'
          rows={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        {userDetails.role !== 'editor' && userDetails.role !== 'admin'
          ? displayArticle?.status !== StatusEnum.pen &&
            displayArticle?.status !== StatusEnum.rej &&
            displayArticle?.status !== StatusEnum.pub && (
              <button
                className='send_btn dbl_submit_btn'
                onClick={() =>
                  handleSubmit(
                    userDetails.role === 'author'
                      ? TargetEnum.auth
                      : TargetEnum.rev
                  )
                }
                disabled={isSendingComment}
                style={
                  isSendingComment
                    ? { opacity: '0.5', cursor: 'not-allowed' }
                    : {}
                }
              >
                Send
              </button>
            )
          : displayArticle?.status !== StatusEnum.pen &&
            displayArticle?.status !== StatusEnum.pub && (
              <>
                {displayArticle?.status !== StatusEnum.rej ? (
                  <>
                    {' '}
                    <button
                      className='send_btn dbl_submit_btn'
                      onClick={() => handleSubmit(TargetEnum.auth)}
                      disabled={isSendingComment}
                      style={
                        isSendingComment
                          ? { opacity: '0.5', cursor: 'not-allowed' }
                          : {}
                      }
                    >
                      Send to Author
                    </button>
                    <button
                      className='send_btn dbl_submit_btn'
                      onClick={() => handleSubmit(TargetEnum.rev)}
                      disabled={isSendingComment}
                      style={
                        isSendingComment
                          ? { opacity: '0.5', cursor: 'not-allowed' }
                          : {}
                      }
                    >
                      Send to Reviewers
                    </button>
                    <button
                      className='send_btn dbl_submit_btn'
                      onClick={() => handleSubmit(TargetEnum.edi)}
                      disabled={isSendingComment}
                      style={
                        isSendingComment
                          ? { opacity: '0.5', cursor: 'not-allowed' }
                          : {}
                      }
                    >
                      Send to Editors
                    </button>{' '}
                  </>
                ) : (
                  userDetails.role === 'admin' && (
                    <>
                      <button
                        className='send_btn dbl_submit_btn'
                        onClick={() => handleSubmit(TargetEnum.auth)}
                        disabled={isSendingComment}
                        style={
                          isSendingComment
                            ? { opacity: '0.5', cursor: 'not-allowed' }
                            : {}
                        }
                      >
                        Send to Author
                      </button>
                      <button
                        className='send_btn dbl_submit_btn'
                        onClick={() => handleSubmit(TargetEnum.rev)}
                        disabled={isSendingComment}
                        style={
                          isSendingComment
                            ? { opacity: '0.5', cursor: 'not-allowed' }
                            : {}
                        }
                      >
                        Send to Reviewers
                      </button>
                      <button
                        className='send_btn dbl_submit_btn'
                        onClick={() => handleSubmit(TargetEnum.edi)}
                        disabled={isSendingComment}
                        style={
                          isSendingComment
                            ? { opacity: '0.5', cursor: 'not-allowed' }
                            : {}
                        }
                      >
                        Send to Editors
                      </button>
                    </>
                  )
                )}
              </>
            )}
      </>
    </DashBoardOverlayLayout>
  );
};

export default Comments;
