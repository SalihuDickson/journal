import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import { topArticles } from '../data';
import { Link } from 'react-router-dom';
import { userSlice } from '../features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../app/store';
import { useGlobalContext } from '../context';
import { useLocation } from 'react-router-dom';
import { ArticleInfoInt } from '../types';
import { timeConverter } from '../helpers/timeConverter';

const Home = () => {
  const { setIsLoggedIn } = userSlice.actions;
  const dispatch = useAppDispatch();
  const { justLoggedOut, setJustLoggedOut } = useGlobalContext();
  const location = useLocation();

  // TODO Ensure to close off every loop hole in displaying published articles

  const { publishedArticles } = useAppSelector((state) => state.article);

  const [otherArticles, setOtherArticles] = useState<ArticleInfoInt[]>([]);

  useEffect(() => {
    if (!otherArticles.length) {
      let modArticles: ArticleInfoInt[] = [];
      let randInds: number[] = [];

      if (publishedArticles.length) {
        for (let i = 0; i < 12; i++) {
          const randInd = Math.floor(Math.random() * publishedArticles.length);

          if (randInds.find((ind) => ind === randInd)) continue;
          else randInds.push(randInd);

          modArticles.push(publishedArticles[randInd]);
        }
      }
      setOtherArticles(modArticles);
    }
  }, [publishedArticles, otherArticles]);

  useEffect(() => {
    setOtherArticles([]);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (justLoggedOut && setJustLoggedOut && location.pathname.length === 1) {
      dispatch(setIsLoggedIn(false));
      setJustLoggedOut(false);
    }
  }, [setJustLoggedOut, justLoggedOut, location]);
  return (
    <section id='home_sect' className='defaults'>
      <Hero />

      <section className='top_articles_sect center_sect'>
        <h2 className='sect_heading'>Top Articles</h2>

        <div className='top_articles_wrapper'>
          {otherArticles.length ? (
            otherArticles.map((article, index) => {
              const artDate = timeConverter(article.publishedAt as string);

              return (
                <div className='top_article_wrapper' key={index}>
                  <Link to={`/article/${article.id}`} className='title'>
                    {article.title}
                  </Link>
                  <div className='bottom'>
                    <span className='author_name'>{article.author}</span>
                    <div className='right_side'>
                      <span className='category'>{article.category}</span>
                      <span className='date_created'>
                        {artDate.getDate()} /{' '}
                        {String(artDate.getMonth()).length < 2
                          ? `0${artDate.getMonth()}`
                          : artDate.getMonth()}{' '}
                        / {String(artDate.getFullYear()).slice(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h2>No Published artices</h2>
          )}
        </div>
      </section>
      <About />
    </section>
  );
};

export default Home;
