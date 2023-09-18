import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  inputError,
  validateCoAuthors,
  customValidate,
} from '../helpers/formHandling';
import ShortUniqueId from 'short-unique-id';
import { uploadArticle } from '../features/article/articleAsyncuThunk';
import { useAppDispatch, useAppSelector } from '../app/store';
import { articleSlice } from '../features/article/articleSlice';
import { FormDataInt } from '../types';

const Submit = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userDetails } = useAppSelector((state) => state.user);
  const [name] = useState(userDetails.name);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [category, setCategory] = useState('default');
  const [affil] = useState(userDetails.affiliation);
  const [mainFile, setMainFile] = useState<File | ''>('');
  const [subFiles, setSubFiles] = useState<FileList | [] | ''>([]);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const abstractInputRef = useRef<HTMLTextAreaElement | null>(null);
  const categoryInputRef = useRef<HTMLSelectElement | null>(null);
  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  const subFilesInputRef = useRef<HTMLInputElement | null>(null);
  const coAuthorsRef = useRef<HTMLInputElement | null>(null);

  const [coAuthors, setCoAuthors] = useState<string>('');

  const dispatch = useAppDispatch();

  const uid = new ShortUniqueId({ length: 7 });
  const { justUploaded, isUploadingAritlce, articleError, categories } =
    useAppSelector((state) => state.article);
  const { resetJustUploaded, resetArticleError } = articleSlice.actions;

  const validateAbsract = (): boolean => {
    const el = abstractInputRef.current;
    if (!abstract) return inputError(el);
    if (abstract.split(' ').length > 250)
      return inputError(el, 'Abstract is greater than 250 words');
    return true;
  };

  const validateCategory = (): boolean => {
    if (category === 'default')
      return inputError(categoryInputRef.current, 'Select category');
    return true;
  };

  const validateMainFile = (): boolean => {
    if (!mainFile) return inputError(null, 'Article file is required');
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      validateCoAuthors(coAuthors, coAuthorsRef.current) &&
      customValidate(title, titleInputRef.current) &&
      validateAbsract() &&
      validateCategory() &&
      validateMainFile()
    ) {
      const data: FormDataInt = {
        id: uid(),
        author: name,
        affiliation: affil,
        abstract,
        category,
        title,
        mainFile,
        subFiles,
        userId: userDetails.id,
        email: userDetails.email,
        coAuthors: coAuthors.trim()
          ? coAuthors.split(',').map((item) => item.trim())
          : [],
      };

      dispatch(uploadArticle(data));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const fileSize = e.target.files?.[0]?.size ?? 0;
    const sizeLimit =
      type === 'main' ? 5242880 : type === 'cover' ? 1048576 : 0;

    if (fileSize && fileSize <= sizeLimit) {
      if (type === 'main') setMainFile(e.target.files?.[0] ?? '');
    } else if (fileSize) {
      if (type === 'main') {
        if (mainFileInputRef.current) mainFileInputRef.current.value = '';
        toast.error('Article file is bigger than 5mb');
      }
    }
  };

  const handleSubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubFiles(e.target.files ?? []);
  };

  const resetForm = () => {
    setTitle('');
    setAbstract('');
    setCategory('default');
    setMainFile('');
    setSubFiles([]);
    setCoAuthors('');
    if (mainFileInputRef.current) mainFileInputRef.current.value = '';
    if (subFilesInputRef.current) subFilesInputRef.current.value = '';
  };

  useEffect(() => {
    if (justUploaded) {
      resetForm();
      toast.success('Article submitted');
      dispatch(resetJustUploaded(''));
    }
  }, [justUploaded]);

  useEffect(() => {
    if (articleError) {
      toast.error('Submission failed');
      dispatch(resetArticleError(''));
    }
  }, [articleError]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoggedIn) {
      toast.info('Login to access page', { toastId: 'login_toast' });
      navigate('/login');
    }
  }, [isLoggedIn]);

  return (
    <section id='submit_sect'>
      <div className='center_sect'>
        <h3 className='sect_heading'>Submit Article</h3>

        <form className='submit_form' onSubmit={handleSubmit}>
          <div className='form_opt'>
            <input
              type='text'
              placeholder="Author's name (e.g Dr. John Doe)"
              value={name}
              className='disable_input'
              readOnly
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder="Co-Authors (seperate with comma ',')"
              value={coAuthors}
              onChange={(e) => setCoAuthors(e.target.value)}
              ref={coAuthorsRef}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder="Article's title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              ref={titleInputRef}
            />
          </div>

          <div className='form_opt'>
            <textarea
              placeholder='Abstract (not more than 250 words)'
              className='abstract'
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              ref={abstractInputRef}
            ></textarea>
          </div>

          <div className='form_opt'>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              ref={categoryInputRef}
            >
              <option value='default' disabled>
                Category
              </option>
              {categories.map((categ) => (
                <option value={categ} key={categ}>
                  {categ}
                </option>
              ))}
            </select>
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Affiliation'
              value={affil}
              className='disable_input'
              readOnly
            />
          </div>

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
              <span>Supplementary file</span> (figures, tables, multimedia, etc.
              not exceeding 10mb)
            </label>
            <input
              type='file'
              id='other_file'
              multiple
              onChange={handleSubFileChange}
              ref={subFilesInputRef}
            />
          </div>

          <div className='btn_wrapper'>
            <button
              className='submit_btn'
              style={
                isUploadingAritlce
                  ? { opacity: '0.5', cursor: 'not-allowed' }
                  : {}
              }
              disabled={isUploadingAritlce}
            >
              {isUploadingAritlce ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Submit;
