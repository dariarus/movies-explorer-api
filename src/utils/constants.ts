import mongoose from 'mongoose';
import validator from 'validator';

// ^ - начало строки
// * - буквы, цифры и символы внутри [] повторяются 0 и более раз
export const NAME_EN_REGEX = /^[A-Za-z0-9 -:]*$/;
export const NAME_RU_REGEX = /^[А-Яа-я0-9 -:]*$/;

export const validateId = (value: mongoose.ObjectId) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new Error('Неверный формат id');
  }
  return value;
};

export const validateURL = (value: string) => {
  if (!validator.isURL(value)) {
    throw new Error('Неверный формат URL');
  }
  return value;
};
