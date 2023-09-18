import React, { useState, useEffect } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { useGlobalContext } from '../../../context';
import { ArticleInfoInt } from '../../../types';
import { useAppSelector } from '../../../app/store';

const Authors = () => {
  const { authorsArticleId } = useGlobalContext();
  const [currentArticle, setCurrentArticle] = useState<ArticleInfoInt | null>(
    null
  );
  const {
    userDetails: { role, name },
  } = useAppSelector((state) => state.user);
  const { editorArticles, allArticles } = useAppSelector(
    (state) => state.article
  );

  useEffect(() => {
    if (authorsArticleId) {
      const articles = role === 'admin' ? allArticles : editorArticles;

      setCurrentArticle(
        articles.find((art) => art.id === authorsArticleId) ?? null
      );
    }
  }, [authorsArticleId, editorArticles, allArticles]);

  return (
    <DashBoardOverlayLayout type='authors'>
      {currentArticle ? (
        <div className='author_wrapper'>
          <div className='main_auth'>
            <h3>Author</h3>
            <p className='author_name'>
              {currentArticle.author} ({currentArticle.email})
            </p>
          </div>

          {currentArticle.coAuthors.length ? (
            <div className='co_auths'>
              <h3>Co-Authors</h3>
              {currentArticle.coAuthors.map((auth, ind) => (
                <p className='author_name'>{auth}</p>
              ))}
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        'Authors info not available'
      )}
    </DashBoardOverlayLayout>
  );
};

export default Authors;
