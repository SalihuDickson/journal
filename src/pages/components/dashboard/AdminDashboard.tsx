import React, { useRef, useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useGlobalContext } from '../../../context';
import { useAppSelector } from '../../../app/store';
import DashBoardContents from './DashBoardContents';
import { ArticleInfoInt, StatusEnum } from '../../../types';

// TODO ENSURE TO HOOK UP displayArticles TO pageSect

const AdminDashboard = () => {
  const header = useRef([
    'Id',
    'Title',
    'Category',
    'Status',
    'Comments',
    "Vers'",
    "Rev'ers",
    'Editors',
    "Auth's",
  ]);
  const {
    pageSect,
    dashStatusFilter,
    dashPageNumber,
    dashArticlesPerPage,
    setIsReload,
    setGrandModArticles,
    grandModArticles,
    setDashPageNumber,
  } = useGlobalContext();

  // ? Author comment contains comments between editor(s) and author
  // ? Reviewers comment contains comments between editor(s) and reviewwers
  // ? Editor comment contains comments between chief editor and editor(s)
  // ? All these are for the specific article

  const { allArticles } = useAppSelector((state) => state.article);
  const [displayArticles, setDisplayArticles] = useState<ArticleInfoInt[]>([]);

  useEffect(() => {
    if (dashPageNumber && dashArticlesPerPage) {
      let modDispArticles: ArticleInfoInt[];
      switch (pageSect) {
        case 'all':
          modDispArticles = allArticles;
          break;

        case 'rev':
          modDispArticles = allArticles.filter(
            (article) => article.status === 'reviewing'
          );
          break;

        case 'sub':
          modDispArticles = allArticles.filter(
            (article) => article.status === 'submitted'
          );
          break;

        default:
          return;
      }

      switch (dashStatusFilter) {
        case 'all':
          break;
        case StatusEnum.sub:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.sub
          );
          setDashPageNumber && setDashPageNumber(1);
          break;
        case StatusEnum.rev:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.rev
          );
          setDashPageNumber && setDashPageNumber(1);
          break;
        case StatusEnum.rej:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.rej
          );
          setDashPageNumber && setDashPageNumber(1);
          break;
        case StatusEnum.app:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.app
          );
          setDashPageNumber && setDashPageNumber(1);
          break;
        case StatusEnum.pen:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.pen
          );
          setDashPageNumber && setDashPageNumber(1);
          break;
        case StatusEnum.pub:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.pub
          );
          setDashPageNumber && setDashPageNumber(1);
          break;

        default:
          return;
      }
      const start = dashArticlesPerPage * (dashPageNumber - 1);
      const end = start + dashArticlesPerPage;

      setGrandModArticles && setGrandModArticles(modDispArticles);

      setDisplayArticles(modDispArticles.slice(start, end));
      setDisplayArticles(modDispArticles.slice(start, end));
    }
  }, [
    pageSect,
    allArticles,
    dashPageNumber,
    dashStatusFilter,
    dashArticlesPerPage,
  ]);

  useEffect(() => {
    setIsReload && setIsReload(true);
  }, [dashStatusFilter, dashPageNumber]);

  return (
    <DashboardLayout headerContent={header.current}>
      {displayArticles.length ? (
        displayArticles.map((article) => (
          <DashBoardContents article={article} />
        ))
      ) : (
        <h3>No article</h3>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
