import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../app/store';
import { v4 } from 'uuid';
import { CommentsInt } from '../../../../types';
import { timeConverter } from '../../../../helpers/timeConverter';

interface AdminEditorCommentPropInt {
  comments: CommentsInt;
}

enum NavOpt {
  auth = 'author',
  rev = 'reviewers',
  edi = 'editors',
}

const AdminEditorComment: React.FC<AdminEditorCommentPropInt> = ({
  comments,
}) => {
  const {
    userDetails: { role, id },
  } = useAppSelector((state) => state.user);

  const [displayComments, setDisplayComments] = useState(comments?.author);
  const [navOpt, setNavOpt] = useState<NavOpt>(NavOpt.auth);

  useEffect(() => {
    setDisplayComments(comments[navOpt]);
  }, [navOpt, comments]);

  return (
    <div className='chat_sect'>
      <nav className='btns_wrapper'>
        <button
          className={`nav_btn ${navOpt === 'author' ? 'active' : ''}`}
          onClick={() => setNavOpt(NavOpt.auth)}
        >
          Author
        </button>
        <button
          className={`nav_btn ${navOpt === 'reviewers' ? 'active' : ''}`}
          onClick={() => setNavOpt(NavOpt.rev)}
        >
          Reviewers
        </button>
        <button
          className={`nav_btn ${navOpt === 'editors' ? 'active' : ''}`}
          onClick={() => setNavOpt(NavOpt.edi)}
        >
          Editors
        </button>
      </nav>

      <div className='comments'>
        {displayComments.map(({ senderId, message, timestamp, name }) => {
          const commentTime = timeConverter(timestamp);

          return (
            <article
              key={v4()}
              className={`comment ${senderId === id ? 'my_msg' : ''}`}
            >
              <p className='msg_wrapper'>{message}</p>
              <div className='footer'>
                <span className='msg_sender'>
                  {senderId === id ? 'Me' : name}
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
    </div>
  );
};

export default AdminEditorComment;
