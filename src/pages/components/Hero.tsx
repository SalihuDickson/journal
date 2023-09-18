import React, { useState, useEffect } from 'react';
// import { heroInfo } from '../../data';
import { Link } from 'react-router-dom';
import { ArticleInfoInt } from '../../types';
import HeroImg1 from '../../assets/hero/Hero_img1.jpg';
import HeroImg2 from '../../assets/hero/Hero_img2.jpg';
import HeroImg3 from '../../assets/hero/Hero_img3.jpg';
import { useAppSelector } from '../../app/store';

interface HeroInfoInt extends ArticleInfoInt {
  imgUrl?: string;
}

const Hero = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroInfo, setHeroInfo] = useState<HeroInfoInt[]>([]);

  const { publishedArticles } = useAppSelector((state) => state.article);

  useEffect(() => {
    if (!heroInfo.length) {
      let modArticles: ArticleInfoInt[] | HeroInfoInt[] = [];
      let randInds: number[] = [];

      for (let i = 0; ; i++) {
        const randInd = Math.floor(Math.random() * publishedArticles.length);

        if (randInds.find((ind) => ind === randInd)) continue;
        else randInds.push(randInd);

        modArticles.push(publishedArticles[randInd]);
        if (modArticles.length === 3) break;
      }
      modArticles = modArticles.map((article, ind) => ({
        ...article,
        imgUrl: ind === 1 ? HeroImg1 : ind === 2 ? HeroImg2 : HeroImg3,
      }));

      setHeroInfo(modArticles as HeroInfoInt[]);
    }
  }, [publishedArticles, heroInfo]);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex(heroIndex === heroInfo.length - 1 ? 0 : heroIndex + 1);
    }, 5000);

    return () => clearInterval(heroInterval);
  }, [heroIndex]);

  return (
    <section id='hero_sect'>
      {heroInfo.map((hero, index) => (
        <article
          className='post_wrapper'
          key={index}
          style={{
            backgroundImage: `url(${hero.imgUrl})`,
            opacity: `${heroIndex === index ? '1' : '0'}`,
            pointerEvents: `${heroIndex === index ? 'auto' : 'none'}`,
          }}
        >
          <div className='post_info'>
            <h2 className='title'>{hero.title}</h2>
            <p className='desc'>
              {hero?.abstract.split(' ').splice(0, 50).join(' ')}...
            </p>
            <Link to={`/article/${hero.id}`}>READ MORE</Link>
          </div>
        </article>
      ))}

      <div className='selector_wrapper'>
        {heroInfo.map((hero, index) => (
          <button
            key={index}
            className={`${heroIndex === index ? 'active' : ''} selector_btn`}
            onClick={() => setHeroIndex(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
