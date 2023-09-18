import React, { useEffect, useState, useRef } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { FaTrashAlt } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import { updateCateg } from '../../../features/article/articleAsyncuThunk';
import { toast } from 'react-toastify';
import { articleSlice } from '../../../features/article/articleSlice';
import { validateName } from '../../../helpers/formHandling';

const Categories = () => {
  const {
    categories,
    isUpdatingCateg,
    justUpdatedCateg,
    isUpdatingCategFailed,
  } = useAppSelector((state) => state.article);

  const dispatch = useAppDispatch();

  const [newCateg, setNewCateg] = useState('');

  const categInputRef = useRef<HTMLInputElement | null>(null);

  const { resetJustUpdatedCateg, resetIsUpdatingCategFailed } =
    articleSlice.actions;

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateName(newCateg, categInputRef.current)) {
      const data = [...new Set([...categories, newCateg.toLocaleLowerCase()])];

      dispatch(updateCateg(data));
      setNewCateg('');
    }
  };

  useEffect(() => {
    if (justUpdatedCateg) {
      toast.success('Categories updated');
      dispatch(resetJustUpdatedCateg(''));
    }
    if (isUpdatingCategFailed) {
      toast.error('Update failed');
      dispatch(resetIsUpdatingCategFailed(''));
    }
    resetIsUpdatingCategFailed('');
  }, [justUpdatedCateg, isUpdatingCategFailed]);

  return (
    <DashBoardOverlayLayout type='categories'>
      <div className='categories_wrapper'>
        <h3 className='heading'>All Categories</h3>
        {categories.length ? (
          <div className='categories'>
            {categories.map((categ) => (
              <Category name={categ} />
            ))}
          </div>
        ) : (
          <h4 className='empty_categ'>No category</h4>
        )}

        <form className='new_categ' onSubmit={handleAdd}>
          <input
            type='text'
            placeholder='Enter New Category'
            value={newCateg}
            onChange={(e) => setNewCateg(e.target.value)}
            ref={categInputRef}
          />
          <button
            className='add_btn'
            style={
              isUpdatingCateg
                ? {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  }
                : {}
            }
            disabled={isUpdatingCateg}
          >
            {isUpdatingCateg ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </DashBoardOverlayLayout>
  );
};

export default Categories;

interface CategoryPropsInt {
  name: string;
}

const Category: React.FC<CategoryPropsInt> = ({ name }) => {
  const dispatch = useAppDispatch();

  const { categories, isUpdatingCateg } = useAppSelector(
    (state) => state.article
  );
  const handleDelete = () => {
    const modCategories = categories.filter((categ) => categ !== name);
    dispatch(updateCateg(modCategories));
  };

  return (
    <div className='category' key={name}>
      <span className='categ_name'>{name}</span>
      <button
        className='delete_btn'
        onClick={handleDelete}
        style={
          isUpdatingCateg
            ? {
                opacity: 0.5,
                cursor: 'not-allowed',
              }
            : {}
        }
        disabled={isUpdatingCateg}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};
