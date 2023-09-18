import React, { useRef, useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useGlobalContext } from '../../../context';
import { useAppSelector } from '../../../app/store';
import DashBoardContents from './DashBoardContents';
import { ArticleInfoInt, PageSectEnum } from '../../../types';

const ReviewerDashboard = () => {
  const header = useRef(['Id', 'Title', 'Category', 'Comments', 'Versions']);

  // ? Author comment contains comments between editor(s) and author
  // ? Reviewers comment contains comments between editor(s) and reviewwers
  // ? Editor comment contains comments between chief editor and editor(s)
  // ? All these are for the specific article

  const { reviewerArticles } = useAppSelector((state) => state.article);
  const [displayArticles, setDisplayArticles] = useState<ArticleInfoInt[]>([]);
  const { pageSect, setGrandModArticles } = useGlobalContext();

  useEffect(() => {
    let modDispArticles: ArticleInfoInt[];
    switch (pageSect) {
      case 'all':
        modDispArticles = reviewerArticles;
        break;

      case 'rev':
        modDispArticles = reviewerArticles.filter(
          (article) => article.status === 'reviewing'
        );
        break;

      default:
        return;
    }

    setGrandModArticles && setGrandModArticles(modDispArticles);
    setDisplayArticles(modDispArticles);
  }, [pageSect, reviewerArticles]);

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

export default ReviewerDashboard;
