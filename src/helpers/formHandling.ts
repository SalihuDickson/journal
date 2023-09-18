import { toast } from 'react-toastify';
import { regex } from '../data';

export const inputError = (
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
  msg = 'All fields are required!'
): false => {
  toast.error(msg);
  el?.focus();
  return false;
};

const validateName = (name: string, el: HTMLInputElement | null): boolean => {
  if (!name) return inputError(el);

  if (!regex.specialAlpha.test(name))
    return inputError(
      el,
      'Name can contain only letters, hypens and single quotes!'
    );

  return true;
};

const validateCoAuthors = (
  inputValue: string,
  el: HTMLInputElement | null
): boolean => {
  if (inputValue && !regex.specialAlpha2.test(inputValue))
    return inputError(
      el,
      'Co-Authors can contain only letters, hypens, single quotes and commas!'
    );
  return true;
};

const validateTitle = (title: string, el: HTMLInputElement | null): boolean => {
  if (!title) return inputError(el);

  if (!regex.specialAlpha.test(title))
    return inputError(
      el,
      'Title can contain only letters, hypens and single quotes!'
    );

  return true;
};

const validateEmail = (email: string, el: HTMLInputElement | null): boolean => {
  if (!email) return inputError(el);
  if (!regex.email.test(email)) return inputError(el, 'Input valid email!');

  return true;
};

const validateDept = (dept: string, el: HTMLInputElement | null): boolean => {
  if (!dept) return inputError(el);

  if (!regex.specialAlpha.test(dept))
    return inputError(
      el,
      'Dept can contain only letters, hypens and single quotes!'
    );

  return true;
};

const validatePassword = (
  password: string,
  el: HTMLInputElement | null
): boolean => {
  if (!password) return inputError(el);
  if (password.length < 8)
    return inputError(el, 'Password must be at least 8 characters!');
  if (!regex.notStrongPword.test(password))
    return inputError(
      el,
      'Password must contain at least one lowercase and uppercase letter and number!'
    );

  return true;
};

const validateConPassword = (
  conPassword: string,
  password: string,
  el: HTMLInputElement | null
) => {
  if (conPassword !== password)
    return inputError(el, 'Passwords are not the same!');

  return true;
};

const validateAffil = (
  affiliation: string,
  el: HTMLInputElement | null
): boolean => {
  if (!affiliation) return inputError(el);
  if (!regex.specialAlpha.test(affiliation))
    return inputError(
      el,
      'Affiliation can contain only letters, hypens and single quotes!'
    );
  return true;
};

const customValidate = (
  value: string,
  el: HTMLInputElement | HTMLTextAreaElement | null
): boolean => {
  if (!value) return inputError(el);
  return true;
};

export {
  validateName,
  validateAffil,
  validateConPassword,
  validateDept,
  validateEmail,
  validatePassword,
  validateTitle,
  customValidate,
  validateCoAuthors,
};
