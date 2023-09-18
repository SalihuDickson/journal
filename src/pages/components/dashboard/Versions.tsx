import React, { useState, useEffect, useRef } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import { ArticleInfoInt, StatusEnum } from '../../../types';
import { useGlobalContext } from '../../../context';
import { timeConverter } from '../../../helpers/timeConverter';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { inputError } from '../../../helpers/formHandling';
import {
  updateAbstract,
  uploadVersion,
} from '../../../features/article/articleAsyncuThunk';
import { articleSlice } from '../../../features/article/articleSlice';

const Versions = () => {
  const { authorArticles, reviewerArticles, editorArticles, allArticles } =
    useAppSelector((state) => state.article);
  const { userDetails } = useAppSelector((state) => state.user);
  const [displayArticle, setDisplayArticle] = useState<ArticleInfoInt | null>(
    null
  );
  const { versionArticleId } = useGlobalContext();

  const [isOpenSubMdal, setisOpenSubModal] = useState({
    state: false,
    type: '',
  });

  useEffect(() => {
    if (versionArticleId) {
      switch (userDetails.role) {
        case 'author':
          setDisplayArticle(
            authorArticles.find((article) => article.id === versionArticleId) ??
              null
          );
          break;

        case 'reviewer':
          setDisplayArticle(
            reviewerArticles.find(
              (article) => article.id === versionArticleId
            ) ?? null
          );
          break;

        case 'editor':
          setDisplayArticle(
            editorArticles.find((article) => article.id === versionArticleId) ??
              null
          );
          break;

        default:
          setDisplayArticle(
            allArticles.find((article) => article.id === versionArticleId) ??
              null
          );
          return;
      }
    }
  }, [
    userDetails,
    authorArticles,
    editorArticles,
    reviewerArticles,
    allArticles,
    versionArticleId,
  ]);

  return (
    <DashBoardOverlayLayout type='versions'>
      <div className='version_super_wrapper'>
        <div className='versions_wrapper'>
          {displayArticle?.verUrls &&
            displayArticle.verUrls.map((url, ind) => {
              const verDate = timeConverter(url.timestamp);

              return (
                <div className='version' key={ind}>
                  <h3 className='top'>
                    <span className='date_wrapper'>
                      {verDate.getDate()} /{' '}
                      {String(verDate.getMonth()).length < 2
                        ? `0${verDate.getMonth()}`
                        : verDate.getMonth()}{' '}
                      / {String(verDate.getFullYear()).slice(2)}
                    </span>

                    <span className='time_wrapper'>
                      {String(verDate.getHours()).length < 2
                        ? `0${verDate.getHours()}`
                        : verDate.getHours()}{' '}
                      :{' '}
                      {String(verDate.getMinutes()).length < 2
                        ? `0${verDate.getMinutes()}`
                        : verDate.getMinutes()}
                    </span>
                  </h3>

                  <div className='main'>
                    <div className='main_url_wrapper'>
                      <a href={url.mainUrl} download>
                        Download main file
                      </a>
                    </div>

                    <div className='sup_url_wrapper'>
                      {url.subUrls.map((sub, inx) => (
                        <a href={sub} download key={inx}>
                          Download supplementary {inx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {displayArticle?.status !== StatusEnum.pen &&
          displayArticle?.status !== StatusEnum.pub &&
          displayArticle?.status !== StatusEnum.rej && (
            <aside className='ver_right_side'>
              {userDetails.role === 'author' && (
                <button
                  className='upload_btn'
                  onClick={() =>
                    setisOpenSubModal({ state: true, type: 'upload' })
                  }
                >
                  New version
                </button>
              )}
              {
                <button
                  className='abstract_btn'
                  onClick={() =>
                    setisOpenSubModal({ state: true, type: 'abstract' })
                  }
                >
                  {userDetails.role === 'author'
                    ? 'Edit Abstract'
                    : 'Show Abstract'}
                </button>
              }
            </aside>
          )}
      </div>

      {isOpenSubMdal.state && (
        <SubModal
          type={isOpenSubMdal.type}
          article={displayArticle}
          closeModal={setisOpenSubModal}
        />
      )}
    </DashBoardOverlayLayout>
  );
};

export default Versions;

interface SubModalPropInt {
  type: string;
  article: ArticleInfoInt | null;
  closeModal: React.Dispatch<
    React.SetStateAction<{
      state: boolean;
      type: string;
    }>
  >;
}

const SubModal: React.FC<SubModalPropInt> = ({ type, article, closeModal }) => {
  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  const subFilesInputRef = useRef<HTMLInputElement | null>(null);
  const [mainFile, setMainFile] = useState<File | ''>('');
  const [subFiles, setSubFiles] = useState<FileList | '' | []>('');
  const [abstract, setAbstract] = useState(article?.abstract);
  const abstractInputRef = useRef<HTMLTextAreaElement | null>(null);

  const { setIsReload } = useGlobalContext();

  const { userDetails } = useAppSelector((state) => state.user);
  const {
    isUploadingVersion,
    isVerUploadFailed,
    justUploadedVer,
    isUpdatingAbstract,
    isUpdatingAbstractFailed,
    justUpdatedAbstract,
  } = useAppSelector((state) => state.article);
  const {
    resetIsVerUploadFailed,
    resetJustUploadeVer,
    resetJustUpdatedAbstract,
    resetIsUpdatingAbstractFailed,
  } = articleSlice.actions;
  const dispatch = useAppDispatch();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const fileSize = e.target.files?.[0]?.size ?? 0;
    const sizeLimit =
      type === 'main' ? 5242880 : type === 'cover' ? 1048576 : 0;

    if (fileSize && fileSize <= sizeLimit) {
      setMainFile(e.target.files?.[0] ?? '');
    } else if (fileSize) {
      if (mainFileInputRef.current) mainFileInputRef.current.value = '';
      toast.error('Article file is bigger than 5mb');
    }
  };

  const handleSubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubFiles(e.target.files ?? []);
  };

  const validateMainFile = (): boolean => {
    if (!mainFile) return inputError(null, 'Article file is required');
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateMainFile()) {
      console.log('subFiles: ', subFiles);

      dispatch(
        uploadVersion({
          mainFile,
          subFiles,
          id: article!.id,
        })
      );
    }
  };

  const validateAbsract = (): boolean => {
    const el = abstractInputRef.current;
    if (!abstract) return inputError(el);
    if (abstract.split(' ').length > 250)
      return inputError(el, 'Abstract is greater than 250 words');
    return true;
  };

  const handleAbstractUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (validateAbsract()) {
      dispatch(
        updateAbstract({ abstract: abstract ?? '', articleId: article!.id })
      );
    }
  };

  useEffect(() => {
    if (isVerUploadFailed) {
      toast.error('Upload failed');
      dispatch(resetIsVerUploadFailed(''));
    }

    if (justUploadedVer) {
      toast.success('Upload successful');
      dispatch(resetJustUploadeVer(''));
    }
  }, [isVerUploadFailed, justUploadedVer]);

  useEffect(() => {
    if (justUpdatedAbstract) {
      toast.success('Abstracted updated');
      dispatch(resetJustUpdatedAbstract(''));
    }

    if (isUpdatingAbstractFailed) {
      toast.error('Abstract update failed');
      dispatch(resetIsUpdatingAbstractFailed(''));
    }
  }, [justUpdatedAbstract, isUpdatingAbstractFailed]);

  return (
    <section className='ver_sub_modal'>
      <div className='ver_sub_modal_wrapper'>
        <button
          className='close_btn'
          onClick={() => closeModal({ state: false, type: '' })}
        >
          <FaTimes />
        </button>
        {type === 'upload' ? (
          <form className='ver_form' onSubmit={handleSubmit}>
            <div className='form_opt file_input_wrapper'>
              <label htmlFor='art_file'>
                <span>Artilce file</span> (only pdfs, not more than 5mb)
              </label>
              <input
                type='file'
                id='art_file'
                accept='.pdf'
                onChange={(e) => handleFileChange(e, 'main')}
                ref={mainFileInputRef}
              />
            </div>

            <div className='form_opt file_input_wrapper'>
              <label htmlFor='other_file'>
                <span>Supplementary file</span> (figures, tables, multimedia,
                etc. not exceeding 10mb)
              </label>
              <input
                type='file'
                id='other_file'
                multiple
                onChange={handleSubFileChange}
                ref={subFilesInputRef}
              />
            </div>

            <button
              className='submit_files upload_btn'
              style={
                isUploadingVersion
                  ? { opacity: '0.5', cursor: 'not-allowed' }
                  : {}
              }
              disabled={isVerUploadFailed}
            >
              {isUploadingVersion ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        ) : (
          <>
            <textarea
              value={abstract ?? ''}
              onChange={(e) => setAbstract(e.target.value)}
              readOnly={userDetails.role !== 'author'}
              className='abstract'
              ref={abstractInputRef}
            ></textarea>

            {userDetails.role === 'author' && (
              <button
                className='update_abs_btn upload_btn'
                onClick={handleAbstractUpdate}
                disabled={isUpdatingAbstract}
                style={
                  isUpdatingAbstract
                    ? { opacity: '0.5', cursor: 'not-allowed' }
                    : {}
                }
              >
                {isUpdatingAbstract ? 'Updating...' : 'Update'}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};
