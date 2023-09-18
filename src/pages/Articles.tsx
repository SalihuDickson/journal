import React, { useEffect, useState, useRef } from 'react';
import { BsSearch, BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { ArticleInfoInt } from '../types';
import { useAppDispatch, useAppSelector } from '../app/store';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

// TODO FOR SUBMIT, IF USER IS NOT SIGNED IN, SET lINK TO LOGIN PAGE

const Articles = () => {
  const { publishedArticles, volCount, categories, currentIssue } =
    useAppSelector((state) => state.article);

  const [searchValue, setSearchValue] = useState('');
  const [currentPageArticles, setCurrentPageArticles] = useState<
    ArticleInfoInt[]
  >([]);
  const displayLimit = useRef(10);
  const [pageCount, setPageCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [sort, setSort] = useState('title');
  const [order, setOrder] = useState('asc');
  const [displayArticles, setDisplayArticles] =
    useState<ArticleInfoInt[]>(publishedArticles);
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [categFilter, setCategFilter] = useState(['all']);
  const [volsFilter, setVolsFilter] = useState(volCount.count);
  const [issuesFilter, setIssuesFilter] = useState<Number>(0);
  const [showCount, setShowCount] = useState({ start: 0, end: 0 });

  const applyBtnRef = useRef<HTMLButtonElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchDisplayArticles, setSearchDisplayArticles] = useState<
    ArticleInfoInt[]
  >([]);

  const [isReset, setIsReset] = useState(false);

  const handleReset = (e: React.MouseEvent) => {
    setFromYear('');
    setToYear('');
    setSearchValue('');
    setVolsFilter(volCount.count);
    setIssuesFilter(0);
    setCategFilter(['all']);
    setSearchParams({}, { replace: true });
    setCurrentPageNumber(1);
    setIsReset(true);
  };

  const handleApply = (e: React.MouseEvent) => {
    setSearchParams(
      {
        s: searchValue,
        fromYear,
        toYear,
        categ: categFilter.join('_'),
        vol: String(volsFilter),
        is: String(issuesFilter),
      },
      { replace: true }
    );

    setDisplayArticles(handleFiltering());
    setCurrentPageNumber(1);
  };

  const handleFiltering = (): ArticleInfoInt[] => {
    let grandModArticles = searchDisplayArticles;

    // *Volume
    grandModArticles = grandModArticles.filter((art) => art.vol === volsFilter);

    // *Issues
    if (issuesFilter)
      grandModArticles = grandModArticles.filter(
        (art) => art.issue === issuesFilter
      );

    // *Category
    if (!categFilter.find((categ) => categ === 'all')) {
      let modArticles: ArticleInfoInt[] = [];
      for (let i = 0; i < categFilter.length; i++) {
        modArticles.push(
          ...grandModArticles.filter((art) => art.category === categFilter[i])
        );
      }
      grandModArticles = modArticles;
    }

    if (fromYear && toYear) {
      if (validateYear(fromYear) && validateYear(toYear)) {
        grandModArticles =
          grandModArticles.filter(
            (art) =>
              Number((art.publishedAt as string).split(' ')[3]) >=
                Number(fromYear) &&
              Number((art.publishedAt as string).split(' ')[3]) <=
                Number(toYear)
          ) ?? [];
      }
    } else if (fromYear && !toYear) {
      if (validateYear(fromYear)) {
        grandModArticles =
          grandModArticles.filter(
            (art) =>
              Number((art.publishedAt as string).split(' ')[3]) >=
              Number(fromYear)
          ) ?? [];
      }
    } else if (!fromYear && toYear) {
      if (validateYear(toYear)) {
        grandModArticles =
          grandModArticles.filter(
            (art) =>
              Number((art.publishedAt as string).split(' ')[3]) <=
              Number(toYear)
          ) ?? [];
      }
    }

    return grandModArticles;
  };

  const validateYear = (year: string): boolean => {
    if (Number(year) < 2000 || Number(year) > 2050) {
      toast.error('Year value too small or large');
      return false;
    }
    return true;
  };

  const handleCategFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isAll: boolean
  ) => {
    if (isAll) {
      setCategFilter([
        ...new Set([...categFilter.filter((cat) => cat === 'all'), 'all']),
      ]);
    } else {
      if (!categFilter.find((cat) => cat === e.target.value)) {
        setCategFilter([
          ...categFilter.filter((cat) => cat !== 'all'),
          e.target.value,
        ]);
      } else {
        if (categFilter.length === 1)
          setCategFilter([
            ...categFilter.filter((cat) => cat !== e.target.value),
            'all',
          ]);
        else
          setCategFilter([
            ...categFilter.filter((cat) => cat !== e.target.value),
          ]);
      }
    }
  };

  useEffect(() => {
    if (isReset) {
      setDisplayArticles(handleFiltering());
      setIsReset(false);
    }
  }, [isReset]);

  useEffect(() => {
    let grandModArticles = publishedArticles;

    // *Volume
    grandModArticles = grandModArticles.filter((art) => art.vol === volsFilter);

    setDisplayArticles(grandModArticles);
  }, [publishedArticles]);

  useEffect(() => {
    const newArr: number[] = new Array(
      Math.ceil(displayArticles.length / displayLimit.current)
    ).fill(0);
    setPageArray(newArr);
  }, [displayArticles]);

  useEffect(() => {
    let grandModArticles = publishedArticles;

    grandModArticles =
      grandModArticles.filter(
        (art) =>
          art.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          art.author.toLowerCase().includes(searchValue.toLowerCase()) ||
          art.coAuthors.find((auth) =>
            auth.toLowerCase().includes(searchValue.toLowerCase())
          )
      ) ?? [];

    setDisplayArticles(grandModArticles);
    setSearchDisplayArticles(grandModArticles);
  }, [searchValue, publishedArticles]);

  useEffect(() => {
    setSearchValue(searchParams.get('s') ?? '');
    setFromYear(searchParams.get('fromYear') ?? '');
    setToYear(searchParams.get('toYear') ?? '');
    setCategFilter(searchParams.get('categ')?.split('_') ?? ['all']);
    setVolsFilter(Number(searchParams.get('vol') ?? volCount.count));
    setIssuesFilter(Number(searchParams.get('vol') ?? 0));
  }, []);

  useEffect(() => {
    const startPoint = (currentPageNumber - 1) * displayLimit.current;
    const endPoint = startPoint + displayLimit.current;
    setShowCount({
      start: startPoint + 1,
      end:
        endPoint < displayArticles.length ? endPoint : displayArticles.length,
    });

    let modArticles = displayArticles;

    switch (sort) {
      case 'title':
        modArticles = [...modArticles].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 'volume':
        let placeholder: ArticleInfoInt[] = [];
        for (let i = 1; i <= volCount.count; i++) {
          placeholder.push(...modArticles.filter((art) => art.vol === i)!);
        }
        modArticles = placeholder;

        break;
      default:
        return;
    }

    switch (order) {
      case 'asc':
        modArticles = modArticles;
        break;
      case 'desc':
        modArticles = modArticles.reverse();
        break;
      default:
        return;
    }

    setCurrentPageArticles(modArticles.slice(startPoint, endPoint));
  }, [currentPageNumber, sort, order, displayArticles]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id='archives_sect'>
      <h2 className='sect_heading'>Articles</h2>

      <div className='center_sect'>
        <div className='left_side'>
          <form className='search_form' onSubmit={(e) => e.preventDefault()}>
            <input
              type='text'
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSearchParams({
                  s: e.target.value,
                  fromYear,
                  toYear,
                  categ: categFilter.join('_'),
                  vol: String(volsFilter),
                  is: String(issuesFilter),
                });
              }}
              placeholder='Search title, author, or co-author'
            />
            <button className='search_btn'>
              <BsSearch />
            </button>
          </form>

          <div className='filters_wrapper'>
            <article className='filter_wrapper'>
              <h3 className='heading'>By Category</h3>

              <div className='filter_opts'>
                <article className='filter_opt'>
                  <input
                    type='checkbox'
                    name='category'
                    id='category_all'
                    checked={
                      categFilter.length === 1 && categFilter[0] === 'all'
                    }
                    onChange={(e) => handleCategFilterChange(e, true)}
                  />
                  <label htmlFor='category_all'>
                    All <span className='filter_opt_count'>(23)</span>
                  </label>
                </article>

                {categories.map((categ) => (
                  <article className='filter_opt' key={categ}>
                    <input
                      type='checkbox'
                      name='category'
                      id={categ}
                      checked={
                        categFilter.find((item) => item === categ)
                          ? true
                          : false
                      }
                      value={categ}
                      onChange={(e) => handleCategFilterChange(e, false)}
                    />
                    <label
                      htmlFor={categ}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {categ} <span className='filter_opt_count'>(12)</span>
                    </label>
                  </article>
                ))}
              </div>
            </article>

            <article className='filter_wrapper'>
              <h3 className='heading'>By Volumes</h3>

              <div className='filter_opts'>
                {new Array(volCount.count).fill('t').map((vol, ind) => (
                  <article className='filter_opt' key={ind}>
                    <input
                      type='radio'
                      name='volume'
                      id={ind.toString()}
                      value={ind + 1}
                      onChange={(e) => setVolsFilter(Number(e.target.value))}
                      checked={ind + 1 === volsFilter}
                    />
                    <label
                      htmlFor={ind.toString()}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {ind + 1} <span className='filter_opt_count'>(12)</span>
                    </label>
                  </article>
                ))}
              </div>
            </article>

            <article className='filter_wrapper'>
              <h3 className='heading'>By Issues</h3>

              <div className='filter_opts'>
                <article className='filter_opt'>
                  <input
                    type='radio'
                    name='issues'
                    id={(0 + 123).toString()}
                    value={0}
                    onChange={(e) => setIssuesFilter(Number(e.target.value))}
                    checked={0 === issuesFilter}
                  />
                  <label
                    htmlFor={(0 + 123).toString()}
                    style={{ textTransform: 'capitalize' }}
                  >
                    All <span className='filter_opt_count'>(12)</span>
                  </label>
                </article>
                {new Array(4).fill('t').map((issue, ind) => (
                  <article className='filter_opt' key={ind}>
                    <input
                      type='radio'
                      name='issues'
                      id={(ind + 123).toString()}
                      value={ind + 1}
                      onChange={(e) => setIssuesFilter(Number(e.target.value))}
                      checked={ind + 1 === issuesFilter}
                    />
                    <label
                      htmlFor={(ind + 123).toString()}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {ind + 1} <span className='filter_opt_count'>(12)</span>
                    </label>
                  </article>
                ))}
              </div>
            </article>

            <article className='filter_wrapper'>
              <h3 className='heading'>By Year</h3>

              <div className='date_range_wrapper'>
                <div className='from_wrapper'>
                  <h3>From</h3>
                  <input
                    type='number'
                    id='date_from'
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                  />
                </div>
                <div className='to_wrapper'>
                  <h3>To</h3>
                  <input
                    type='number'
                    value={toYear}
                    onChange={(e) => setToYear(e.target.value)}
                  />
                </div>
              </div>
            </article>

            <div className='filter_btns'>
              <button
                className='filter_btn'
                onClick={handleApply}
                ref={applyBtnRef}
              >
                Apply
              </button>
              <button className='filter_btn' onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className='right_side'>
          <header>
            <div className='result_info'>
              Showing <strong>{showCount.start}</strong> to{' '}
              <strong>{showCount.end}</strong> of{' '}
              <strong>{displayArticles.length}</strong> articles
            </div>

            <div className='sort_wrapper'>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value='title'>Sort By Title</option>
                <option value='volume'>Sort By Vol.</option>
              </select>

              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value='asc'>Arrange Asc.</option>
                <option value='desc'>Arrange Dsc.</option>
              </select>

              <select
                value={currentPageNumber}
                onChange={(e) => setCurrentPageNumber(Number(e.target.value))}
              >
                {pageArray.map((page, index) => (
                  <option value={`${index + 1}`}>Page {index + 1}</option>
                ))}
              </select>
            </div>
          </header>

          <div className='articles_wrapper'>
            {currentPageArticles.map((art) => (
              <article className='article_wrapper' key={art.id}>
                <div className='info'>
                  <div className='authors'>
                    <div className='author'>
                      <span className='icon'>
                        <BsPerson />
                      </span>
                      <span className='name'>{art.author}</span>
                    </div>
                    {art.coAuthors.length && art.coAuthors[0] ? (
                      <div className='co_authors'>
                        <span className='heading'>Co-authors:</span>

                        {art.coAuthors.map((auth, ind) => (
                          <span className='co_name' key={ind}>
                            {auth}
                          </span>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>

                  <h4 className='title'>
                    <Link to={`/article/${art.id}`}>{art.title}</Link>
                  </h4>
                  <p className='desc'>
                    {art.abstract.split(' ').splice(0, 30).join(' ')}...
                  </p>

                  <div className='bottom_wrapper'>
                    <Link to={`/article/${art.id}`} className='link'>
                      View Full Article
                    </Link>

                    <div className='bot_right'>
                      <span className='category'>{art.category}</span>
                      <span className='vol'>Vol. {art.vol}</span>
                      <span className='issue'>Issue {art.issue}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;
