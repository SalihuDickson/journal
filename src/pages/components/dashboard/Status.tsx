import React, { useDebugValue, useEffect } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { useGlobalContext } from '../../../context';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import { articleSlice } from '../../../features/article/articleSlice';
import { toast } from 'react-toastify';
import { updateStatus } from '../../../features/article/articleAsyncuThunk';
import { ArticleInfoInt, MailEnum } from '../../../types';

interface StatusPropInt {
  roleArticles: ArticleInfoInt[];
}

const Status: React.FC<StatusPropInt> = ({ roleArticles }) => {
  const {
    setSelecetedStatus,
    selectedStatus,
    statusArticleId,
    setIsReload,
    setConfirmations,
    affirm,
    setAffirm,
    setSendMail,
  } = useGlobalContext();
  const { userDetails } = useAppSelector((state) => state.user);
  const {
    allArticles,
    editorArticles,
    isUpdatingStatus,
    isUpdatingStatusFailed,
    justUpdatedStatus,
  } = useAppSelector((state) => state.article);

  const { resetJustUpdatedStatus, resetIsUpdatingStatusFailed } =
    articleSlice.actions;
  const dispatch = useAppDispatch();

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      selectedStatus &&
      (selectedStatus === 'submitted' || selectedStatus === 'reviewing')
    ) {
      dispatch(
        updateStatus({
          status: selectedStatus ?? '',
          articleId: statusArticleId ?? '',
        })
      );
    } else {
      setConfirmations &&
        setConfirmations(
          selectedStatus === 'approved'
            ? { isShow: true, msg: 'approve', type: 'status' }
            : { isShow: true, msg: 'reject', type: 'status' }
        );
    }
  };

  useEffect(() => {
    setSelecetedStatus &&
      setSelecetedStatus(
        roleArticles.find((art) => art.id === statusArticleId)?.status ?? ''
      );
  }, [statusArticleId]);

  useEffect(() => {
    if (userDetails.role === 'admin' && setSelecetedStatus)
      setSelecetedStatus(
        allArticles.find((article) => article.id === statusArticleId)!.status
      );

    if (userDetails.role === 'editor' && setSelecetedStatus)
      setSelecetedStatus(
        editorArticles.find((article) => article.id === statusArticleId)!.status
      );
  }, [userDetails, editorArticles, allArticles, setSelecetedStatus]);

  useEffect(() => {
    if (justUpdatedStatus) {
      toast.success('Status updated');
      dispatch(resetJustUpdatedStatus(''));
    }

    if (isUpdatingStatusFailed) {
      toast.error('Status update failed');
      dispatch(resetIsUpdatingStatusFailed(''));
    }
  }, [justUpdatedStatus, isUpdatingStatusFailed]);

  useEffect(() => {
    if (affirm?.type === 'status' && selectedStatus) {
      dispatch(
        updateStatus({
          status: selectedStatus ?? '',
          articleId: statusArticleId ?? '',
        })
      );

      setSendMail &&
        setSendMail(
          selectedStatus === 'approved'
            ? { state: true, type: MailEnum.appArt, id: statusArticleId ?? '' }
            : { state: true, type: MailEnum.rejArt, id: statusArticleId ?? '' }
        );
      setAffirm && setAffirm({ state: false, type: '' });
    }
  }, [affirm, selectedStatus, setAffirm]);

  return (
    <DashBoardOverlayLayout type='status'>
      <div className='status_wrapper'>
        <h4>Change Article Status</h4>
        <select
          value={selectedStatus}
          id=''
          className='status_selection'
          onChange={(e) =>
            setSelecetedStatus && setSelecetedStatus(e.target.value)
          }
        >
          {status.map((sta, ind) => (
            <option value={sta} key={ind}>
              {sta}
            </option>
          ))}
        </select>

        <button
          className='status_btn dbl_submit_btn'
          onClick={handleUpdate}
          disabled={isUpdatingStatus}
          style={
            isUpdatingStatus
              ? {
                  opacity: '0.5',
                  cursor: 'not-allowed',
                }
              : {}
          }
        >
          {isUpdatingStatus ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </DashBoardOverlayLayout>
  );
};

export default Status;

const status = ['submitted', 'reviewing', 'approved', 'rejected'];
