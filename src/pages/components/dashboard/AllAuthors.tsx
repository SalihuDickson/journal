import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { userSlice } from '../../../features/user/userSlice';
import { getAuthors } from '../../../features/user/userAsyncThunk';
import { toast } from 'react-toastify';
import { StatusEnum, UserInfoInt } from '../../../types';

const AllAuthors = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageArr, setPageArr] = useState<''[]>([]);

  const { allAuthors, isFetchAllAuthorsFailed, isFetchingAllAuthors } =
    useAppSelector((state) => state.user);
  const { allArticles } = useAppSelector((state) => state.article);
  const dispatch = useAppDispatch();

  const { resetIsFetchingAuthorsFailed } = userSlice.actions;
  const [dispAuthors, setDispAuthors] = useState<UserInfoInt[]>([]);
  const [grandDispAuths, setGrandDispAuths] =
    useState<UserInfoInt[]>(allAuthors);
  const [pageLimit] = useState(10);

  useEffect(() => {
    const modDispAuth = allAuthors.filter(
      (auth) =>
        auth.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        auth.id.includes(searchValue)
    );
    setGrandDispAuths(modDispAuth);
  }, [searchValue, allAuthors]);

  useEffect(() => {
    const start = (currentPage - 1) * pageLimit;
    const end = start + pageLimit;
    setDispAuthors(grandDispAuths.slice(start, end));
  }, [currentPage, grandDispAuths]);

  useEffect(() => {
    if (!allAuthors.length) {
      dispatch(getAuthors());
    }
  }, []);

  useEffect(() => {
    setPageArr(
      new Array(Math.ceil(grandDispAuths.length / pageLimit)).fill('')
    );
  }, [grandDispAuths]);

  useEffect(() => {
    if (isFetchAllAuthorsFailed) {
      toast.error('Fetching failed. Reload to try again');
      dispatch(resetIsFetchingAuthorsFailed(''));
    }
  }, [isFetchAllAuthorsFailed]);

  return (
    <DashBoardOverlayLayout type={'all authors'}>
      <div className='all_auth_wrapper'>
        {isFetchingAllAuthors ? (
          'Loading...'
        ) : (
          <>
            <header>
              <input
                type='text'
                placeholder='Search name or id'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />

              <select
                name=''
                id=''
                className='page_wrapper'
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              >
                {pageArr.map((pg, ind) => (
                  <option value={ind + 1}>{ind + 1}</option>
                ))}
              </select>
            </header>
            {dispAuthors.length ? (
              <>
                <div className='main_sect'>
                  <header>
                    <h4 className='head_title'>Id</h4>
                    <h4 className='head_title'>Name</h4>
                    <h4 className='head_title'>Email</h4>
                    <h4 className='head_title'>Affiliation</h4>
                    <h4 className='head_title'>Submitted</h4>
                    <h4 className='head_title'>Reviewing</h4>
                    <h4 className='head_title'>Approved</h4>
                    <h4 className='head_title'>Rejected</h4>
                    <h4 className='head_title'>Pending</h4>
                    <h4 className='head_title'>Published</h4>
                    <h4 className='head_title'>Total</h4>
                  </header>

                  <div className='body'>
                    {dispAuthors.map((auth) => {
                      const authArticles = allArticles.filter(
                        (art) => art.userId === auth.id
                      );

                      const revArticlesCount = authArticles.filter(
                        (art) => art.status === StatusEnum.rev
                      ).length;
                      const rejArticlesCount = authArticles.filter(
                        (art) => art.status === StatusEnum.rej
                      ).length;
                      const appArticlesCount = authArticles.filter(
                        (art) => art.status === StatusEnum.app
                      ).length;
                      const penArticlesCount = authArticles.filter(
                        (art) => art.status === StatusEnum.pen
                      ).length;
                      const pubArticlesCount = authArticles.filter(
                        (art) => art.status === StatusEnum.pub
                      ).length;
                      const subArticlesCount = authArticles.filter(
                        (art) => art.status === StatusEnum.sub
                      ).length;
                      return (
                        <article className='auth_info_wrapper' key={auth.id}>
                          <p className='auth_info' title={auth.id}>
                            {auth.id.slice(0, 3)}...
                            {auth.id.slice(auth.id.length - 3)}
                          </p>
                          <p className='auth_info'>{auth.name}</p>
                          <p className='auth_info'>{auth.email}</p>
                          <p className='auth_info'>{auth.affiliation}</p>
                          <p className='auth_info sub'>{subArticlesCount}</p>
                          <p className='auth_info rev'>{revArticlesCount}</p>
                          <p className='auth_info app'>{appArticlesCount}</p>
                          <p className='auth_info rej'>{rejArticlesCount}</p>
                          <p className='auth_info pen'>{penArticlesCount}</p>
                          <p className='auth_info pub'>{pubArticlesCount}</p>
                          <p className='auth_info total'>
                            {subArticlesCount +
                              revArticlesCount +
                              appArticlesCount +
                              rejArticlesCount +
                              penArticlesCount +
                              pubArticlesCount}
                          </p>
                        </article>
                      );
                    })}

                    <article className='auth_info_wrapper'>
                      <p className='auth_info total_info'>Total</p>
                      <p className='auth_info total_info'>All Articles</p>
                      <p className='auth_info total_info'>nil</p>
                      <p className='auth_info total_info'>nil</p>
                      <p className='auth_info total_info sub'>
                        {
                          allArticles.filter(
                            (art) => art.status === StatusEnum.sub
                          ).length
                        }
                      </p>
                      <p className='auth_info total_info rev'>
                        {
                          allArticles.filter(
                            (art) => art.status === StatusEnum.rev
                          ).length
                        }
                      </p>
                      <p className='auth_info total_info app'>
                        {
                          allArticles.filter(
                            (art) => art.status === StatusEnum.app
                          ).length
                        }
                      </p>
                      <p className='auth_info total_info rej'>
                        {
                          allArticles.filter(
                            (art) => art.status === StatusEnum.rej
                          ).length
                        }
                      </p>
                      <p className='auth_info total_info pen'>
                        {
                          allArticles.filter(
                            (art) => art.status === StatusEnum.pen
                          ).length
                        }
                      </p>
                      <p className='auth_info total_info pub'>
                        {
                          allArticles.filter(
                            (art) => art.status === StatusEnum.pub
                          ).length
                        }
                      </p>
                      <p className='auth_info total_info total'>
                        {allArticles.filter(
                          (art) => art.status === StatusEnum.sub
                        ).length +
                          allArticles.filter(
                            (art) => art.status === StatusEnum.rev
                          ).length +
                          allArticles.filter(
                            (art) => art.status === StatusEnum.app
                          ).length +
                          allArticles.filter(
                            (art) => art.status === StatusEnum.rej
                          ).length +
                          allArticles.filter(
                            (art) => art.status === StatusEnum.pen
                          ).length +
                          allArticles.filter(
                            (art) => art.status === StatusEnum.pub
                          ).length}
                      </p>
                    </article>
                  </div>
                </div>
              </>
            ) : (
              <h4>No Author</h4>
            )}
          </>
        )}
      </div>
    </DashBoardOverlayLayout>
  );
};

export default AllAuthors;
