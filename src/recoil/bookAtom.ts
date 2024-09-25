import { atom } from 'recoil';

export const ownerBookState = atom({
  key: 'ownerBooks',
  default: [],
});
