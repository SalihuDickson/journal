import React, { useRef, useState, useEffect } from 'react';
import ShortUniqueId from 'short-unique-id';
import { v4 } from 'uuid';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useGlobalContext } from '../../../context';
import { articleSlice } from '../../../features/article/articleSlice';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import DashBoardContents from './DashBoardContents';
import { ArticleInfoInt, StatusEnum } from '../../../types';

const EditorDashboard = () => {
  const header = useRef([
    'Id',
    'Title',
    'Category',
    'Status',
    'Comments',
    "Vers'",
    "Rev'ers",
    "Auth's",
  ]);

  // ? Author comment contains comments between editor(s) and author
  // ? Reviewers comment contains comments between editor(s) and reviewwers
  // ? Editor comment contains comments between chief editor and editor(s)
  // ? All these are for the specific article

  const {
    pageSect,
    dashStatusFilter,
    dashPageNumber,
    dashArticlesPerPage,
    setIsReload,
    setGrandModArticles,
  } = useGlobalContext();
  const { editorArticles } = useAppSelector((state) => state.article);
  const [displayArticles, setDisplayArticles] = useState<ArticleInfoInt[]>([]);

  useEffect(() => {
    if (dashPageNumber && dashArticlesPerPage) {
      let modDispArticles: ArticleInfoInt[];
      switch (pageSect) {
        case 'all':
          modDispArticles = editorArticles;
          break;

        case 'rev':
          modDispArticles = editorArticles.filter(
            (article) => article.status === 'reviewing'
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
          break;
        case StatusEnum.rev:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.rev
          );
          break;
        case StatusEnum.rej:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.rej
          );
          break;
        case StatusEnum.app:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.app
          );
          break;
        case StatusEnum.pen:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.pen
          );
          break;
        case StatusEnum.pub:
          modDispArticles = modDispArticles.filter(
            (art) => art.status === StatusEnum.pub
          );
          break;

        default:
          return;
      }
      const start = dashArticlesPerPage * (dashPageNumber - 1);
      const end = start + dashArticlesPerPage;

      setGrandModArticles && setGrandModArticles(modDispArticles);
      setDisplayArticles(modDispArticles.slice(start, end));
    }
  }, [
    pageSect,
    editorArticles,
    dashPageNumber,
    dashStatusFilter,
    dashArticlesPerPage,
  ]);

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

export default EditorDashboard;
