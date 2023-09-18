import React, { useState, useEffect } from 'react';
import { BsPrinter, BsDownload, BsPerson } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import imgUrl from '../assets/team/team4.jpg';
import { allArticles, topArticles } from '../data';
import { useAppSelector, useAppDispatch } from '../app/store';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../services/firbase_config';
import { ArticleInfoInt, VerUrlsInt } from '../types';
import { articleSlice } from '../features/article/articleSlice';
import { EduJournServices } from '../services/EduJournServices';
import { timeConverter } from '../helpers/timeConverter';

// TODO SET UP VER URLS FOR PUBLISHE ARTICLES

const SingleArticle = () => {
  const { publishedArticles } = useAppSelector((state) => state.article);
  const dispatch = useAppDispatch();

  const { setVersions } = articleSlice.actions;

  const { id } = useParams();
  const [currentArticle, setCurrentArticle] = useState<ArticleInfoInt | null>(
    publishedArticles.find((article) => article.id === id) ?? null
  );
  const [isViewFull, setIsViewFull] = useState(false);

  const [relatedArticles, setRelatedArticles] = useState<ArticleInfoInt[]>([]);

  const [pubAt, setPubAt] = useState(new Date());

  const fetchVersions = async () => {
    const querySnapshot = await new EduJournServices().getVersions(id ?? '');
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
        id: id ?? '',
        versions: versions as VerUrlsInt[],
        role: 'published',
      })
    );
  };

  useEffect(() => {
    setCurrentArticle(
      publishedArticles.find((article) => article.id === id) ?? null
    );
    if (!relatedArticles.length) {
      let modArticles: ArticleInfoInt[] = [];
    }
  }, [publishedArticles, relatedArticles, id]);

  useEffect(() => {
    if (currentArticle) {
      let modArticles = publishedArticles.filter(
        (art) => art.category === currentArticle.category
      );

      let start = Math.floor(Math.random() * (modArticles.length - 1));

      if (modArticles.length + 1 - start < 3) {
        start = 0;
      }
      modArticles = modArticles.slice(start, start + 3);

      setRelatedArticles(modArticles);
    }
  }, [currentArticle, publishedArticles]);

  useEffect(() => {
    if (!publishedArticles.find((article) => article.id === id)?.verUrls)
      fetchVersions();
  }, [id]);

  useEffect(() => {
    if (currentArticle) {
      setPubAt(timeConverter(currentArticle.publishedAt));
    }
  }, [currentArticle]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id='single_article_sect'>
      <h3 className='sect_heading'>Article</h3>

      <div className='center_sect'>
        {currentArticle ? (
          currentArticle.verUrls ? (
            <>
              <aside className='main_side'>
                <header className='top'>
                  <div className='action_btns'>
                    <a
                      className='download_btn action_btn'
                      href={currentArticle.verUrls[0].mainUrl}
                      download
                    >
                      <span className='icon'>
                        <BsDownload />
                      </span>
                      Download PDF
                    </a>
                  </div>

                  <div className='title_wrapper'>
                    <h2 className='title'>{currentArticle?.title}</h2>
                    <div className='authors'>
                      <div className='author'>
                        <span className='icon'>
                          <BsPerson />
                        </span>
                        <span className='name'>{currentArticle.author}</span>
                      </div>
                      {currentArticle.coAuthors.length &&
                        currentArticle.coAuthors[0] && (
                          <div className='co_authors'>
                            <span className='heading'>Co-authors:</span>

                            {currentArticle.coAuthors.map((auth, ind) => (
                              <span className='co_name' key={ind}>
                                {auth}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                    <p className='category_wrapper'>
                      <span className='category'>
                        {currentArticle.category}
                      </span>

                      <span className='pub_date'>
                        {pubAt.getDate()} /{' '}
                        {String(pubAt.getMonth()).length < 2
                          ? `0${pubAt.getMonth()}`
                          : pubAt.getMonth()}{' '}
                        / {String(pubAt.getFullYear()).slice(2)}
                      </span>
                    </p>
                  </div>
                </header>

                <main className='main_article'>
                  <h3 className='heading'>Abstract</h3>

                  <div className='text_wrapper'>
                    <p>{currentArticle.abstract}</p>
                  </div>

                  <footer className='action_btns'>
                    <a
                      className='download_btn action_btn'
                      href={currentArticle.verUrls[0].mainUrl}
                      download
                    >
                      <span className='icon'>
                        <BsDownload />
                      </span>
                      Download PDF
                    </a>
                  </footer>
                </main>
              </aside>

              <aside className='side_bar'>
                <h3 className='sect_heading'>Related Articles</h3>

                <div className='articles_wrapper'>
                  {relatedArticles.map((article) => (
                    <Link
                      to={`/article/${article.id}`}
                      className='other_article'
                      key={article.id}
                    >
                      <div className='author'>
                        <span className='icon'>
                          <BsPerson />
                        </span>
                        <span className='author_name'>{article.author}</span>
                      </div>
                      <p className='title'>{article.title}</p>
                    </Link>
                  ))}
                </div>
              </aside>
            </>
          ) : (
            <h2 className='no_article'>Loading ...</h2>
          )
        ) : (
          <h2 className='no_article'>Article does not exist!</h2>
        )}
      </div>
    </section>
  );
};

export default SingleArticle;
