import { atom } from 'recoil';
import { Book } from '../interfaces/interfaces';

export const ownerBookState = atom({
  key: 'ownerBooks',
  default: [],
});

export const userBooksState = atom<Book[]>({
  key: 'userBooksState',
  default: [],
});

