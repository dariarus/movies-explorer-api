import validator from 'validator';

import { INCORRECT_URL } from './request-messanges';

// ^ - начало строки
// * - буквы, цифры и символы внутри [] повторяются 0 и более раз
// export const NAME_EN_REGEX = /^[A-Za-z0-9 ,\-:—&.%"«»'!?]*$/;
// export const NAME_RU_REGEX = /^[А-Яа-яA-Za-z0-9 ,\-:—&.%"«»'!?]*$/;

export const validateURL = (value: string) => {
  if (!validator.isURL(value)) {
    throw new Error(INCORRECT_URL);
  }
  return value;
};
