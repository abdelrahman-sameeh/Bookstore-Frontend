import { atom } from 'recoil';
import { Category } from '../interfaces/interfaces';

export const categoriesState = atom<Category[]>({
  key: 'categories',
  default: [],
});

export const categoryState = atom<Category>({
  key: 'category',
  default: {},
});


