import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../context';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import {
  ArticleInfoInt,
  AssignTypeEnum,
  StatusEnum,
  UserInfoInt,
} from '../../../types';
import { assignTeam } from '../../../features/article/articleAsyncuThunk';
import { articleSlice } from '../../../features/article/articleSlice';
import { toast } from 'react-toastify';

interface AssignInt {
  assignType: AssignTypeEnum;
}

const Assign: React.FC<AssignInt> = ({ assignType }) => {
  const { reviewersArticleId, editorsArticleId } = useGlobalContext();
  const { userDetails, teamInfo } = useAppSelector((state) => state.user);
  const {
    editorArticles,
    allArticles,
    isAssigningTeam,
    isAssigningTeamFailed,
    justAssignedTeam,
  } = useAppSelector((state) => state.article);
  const { resetIsAssigningTeamFailed, resetJustAssignedTeam } =
    articleSlice.actions;

  const [assignedRevs, setAssignedRevs] = useState<UserInfoInt[]>([]);
  const [assignedEdits, setAssignedEdits] = useState<UserInfoInt[]>([]);
  const [currentArticles, setCurrentArticles] = useState<ArticleInfoInt[]>([]);
  const [selectedOpts, setSelectedOpts] = useState<string[]>([]);
  const [displayArticle, setDisplayArticle] = useState<ArticleInfoInt | null>(
    null
  );

  const { setIsReload } = useGlobalContext();

  const dispatch = useAppDispatch();

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkId = e.target.value;

    if (selectedOpts.find((id) => id === checkId))
      setSelectedOpts(selectedOpts.filter((id) => id !== checkId));
    else setSelectedOpts([...selectedOpts, checkId]);
  };

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (assignType === 'reviewer')
      dispatch(
        assignTeam({
          opts: selectedOpts,
          type: AssignTypeEnum.rev,
          articleId: reviewersArticleId ?? '',
        })
      );

    if (assignType === 'editor')
      dispatch(
        assignTeam({
          opts: selectedOpts,
          type: AssignTypeEnum.edi,
          articleId: editorsArticleId ?? '',
        })
      );
  };

  useEffect(() => {
    if (userDetails.role === 'editor') setCurrentArticles(editorArticles);
    if (userDetails.role === 'admin') setCurrentArticles(allArticles);
  }, [editorArticles, allArticles, userDetails]);

  useEffect(() => {
    if (currentArticles.length && teamInfo.length) {
      let assRevs: UserInfoInt[] = [];
      let assRevsId: string[] = [];
      let assEdits: UserInfoInt[] = [];
      let assEditsId: string[] = [];

      switch (assignType) {
        case AssignTypeEnum.rev:
          setDisplayArticle(
            currentArticles.find(
              (article) => article.id === reviewersArticleId
            )!
          );
          currentArticles
            .find((article) => article.id === reviewersArticleId)
            ?.assReviewers.forEach((id) => {
              assRevs.push(teamInfo.find((team) => team?.id === id)!);
              assRevsId.push(id);
            });

          setAssignedRevs(assRevs);
          setSelectedOpts(assRevsId);
          break;

        case AssignTypeEnum.edi:
          setDisplayArticle(
            currentArticles.find((article) => article.id === editorsArticleId)!
          );
          currentArticles
            .find((article) => article?.id === editorsArticleId)
            ?.assEditors.forEach((id) => {
              assEdits.push(teamInfo.find((team) => team?.id === id)!);
              assEditsId.push(id);
            });

          setAssignedEdits(assEdits);
          setSelectedOpts(assEditsId);

          break;

        default:
          return;
      }
    }
  }, [currentArticles, teamInfo]);

  useEffect(() => {
    if (isAssigningTeamFailed) {
      toast.error('Team assign failed');
      resetIsAssigningTeamFailed('');
    }
    if (justAssignedTeam) {
      toast.success('Team assign successful');

      dispatch(resetJustAssignedTeam(''));
    }
  }, [isAssigningTeamFailed, justAssignedTeam]);

  return (
    <>
      <div className='assign_sect'>
        <h3 className='assign_heading'>Assigned</h3>
        <div className='assigned_wrapper'>
          {assignType === 'reviewer' ? (
            assignedRevs.length ? (
              assignedRevs.map((rev) => (
                <span className='assigned_team' key={rev?.id}>
                  {rev?.name}
                </span>
              ))
            ) : (
              <p>None</p>
            )
          ) : assignType === 'editor' ? (
            assignedEdits.length ? (
              assignedEdits.map((edit) => (
                <span className='assigned_team' key={edit?.id}>
                  {edit?.name}
                </span>
              ))
            ) : (
              <p>None</p>
            )
          ) : (
            ''
          )}
        </div>
      </div>

      <div className='assign_sect'>
        <h3 className='assign_heading'>Assign/Un-assign</h3>

        <div className='opts_wrapper'>
          {assignType === 'reviewer'
            ? teamInfo
                .filter((team) => team.role === 'reviewer')
                .map((rev) => (
                  <div className='opt_wrapper' key={rev?.id}>
                    <input
                      value={rev?.id}
                      name='assign_rev'
                      id={rev?.id}
                      type='checkbox'
                      checked={Boolean(
                        selectedOpts.find((id) => id === rev?.id)
                      )}
                      onChange={handleCheck}
                    />
                    <label htmlFor={rev?.id}>{rev?.name}</label>
                  </div>
                ))
            : assignType === 'editor'
            ? teamInfo
                .filter((team) => team.role === 'editor')
                .map((edit) => (
                  <div className='opt_wrapper' key={edit?.id}>
                    <input
                      value={edit?.id}
                      name='assign_edit'
                      id={edit?.id}
                      type='checkbox'
                      checked={Boolean(
                        selectedOpts.find((id) => id === edit?.id)
                      )}
                      onChange={handleCheck}
                    />
                    <label htmlFor={edit?.id}>{edit?.name}</label>
                  </div>
                ))
            : ''}
        </div>
      </div>

      {(displayArticle?.status === StatusEnum.sub ||
        displayArticle?.status === StatusEnum.rev) && (
        <button
          className='update_btn'
          onClick={handleUpdate}
          style={
            isAssigningTeam || userDetails.role !== 'admin'
              ? {
                  opacity: '0.5',
                  cursor: 'not-allowed',
                }
              : {}
          }
          disabled={isAssigningTeam || userDetails.role !== 'admin'}
        >
          {isAssigningTeam ? 'Updating...' : 'Update'}
        </button>
      )}
    </>
  );
};

export default Assign;
