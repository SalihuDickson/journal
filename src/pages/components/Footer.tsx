import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quickLinks, socialLinks } from '../../data';
import { useAppSelector } from '../../app/store';
import { ArticleInfoInt } from '../../types';
import { timeConverter } from '../../helpers/timeConverter';

const Footer = () => {
  const { publishedArticles } = useAppSelector((state) => state.article);
  const [otherArticles, setOtherArticles] = useState<ArticleInfoInt[]>([]);

  useEffect(() => {
    if (!otherArticles.length) {
      let modArticles: ArticleInfoInt[] = [];
      let randInds: number[] = [];

      for (let i = 0; i < 3; i++) {
        const randInd = Math.floor(Math.random() * publishedArticles.length);

        if (randInds.find((ind) => ind === randInd)) continue;
        else randInds.push(randInd);

        modArticles.push(publishedArticles[randInd]);
        setOtherArticles(modArticles);
      }
    }
  }, [publishedArticles, otherArticles]);

  return (
    <footer id='footer_sect'>
      <div className='top'>
        <div className='center_sect'>
          <article className='footer_opt_wrapper'>
            <div className='logo_wrapper'>
              <div className='logo'>
                E<span>J</span>
              </div>
              <p className='company_name'>EduJourn</p>
            </div>

            <article className='footer_opt_part'>
              <h3>Address</h3>

              <p>No. 34 Kugo Street, Gonin-gora</p>
              <p>Kaduna, Kaduna State</p>
              <p>Nigeria</p>
            </article>

            <article className='footer_opt_part'>
              <h3>Contact</h3>

              <p>Call: +234812345678</p>
              <p>Email: edujourn@gmail.com</p>
            </article>
          </article>

          <article className='footer_opt_wrapper'>
            <h3>Some Articles</h3>

            {otherArticles.map((article, index) => {
              const artDate = article.publishedAt
                ? timeConverter(article.publishedAt)
                : new Date();

              return (
                <>
                  <Link
                    to={`/article/${article.id}`}
                    className='articles_link'
                    key={index}
                  >
                    <span className='article_title'>{article.title}</span>

                    <span className='created_at'>
                      {artDate.getDate()} /{' '}
                      {String(artDate.getMonth()).length < 2
                        ? `0${artDate.getMonth()}`
                        : artDate.getMonth()}{' '}
                      / {String(artDate.getFullYear()).slice(2)}
                    </span>
                  </Link>
                </>
              );
            })}

            <Link to='/archives' className='view_all_btn'>
              View all articles
            </Link>
          </article>

          <article className='footer_opt_wrapper'>
            <h3>Quick Links</h3>

            <article className='quick_links_wrapper'>
              {quickLinks.map(({ url, title }, index) => (
                <Link to={url} className='quick_link' key={index}>
                  {title}
                </Link>
              ))}
            </article>

            <h3>Social Links</h3>

            <article className='social_links_wrapper'>
              {socialLinks.map(({ url, Icon }, index) => (
                <a
                  href={url}
                  target='_blank'
                  key={index}
                  className='social_link'
                >
                  <Icon />
                </a>
              ))}
            </article>
          </article>
        </div>
      </div>

      <div className='bottom'>
        <div className='center_sect'>
          copyright &copy; 2023 . <Link to='/'>EduJourn</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
