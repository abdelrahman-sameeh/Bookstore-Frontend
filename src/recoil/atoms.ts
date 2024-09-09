import { atom } from 'recoil';

export const themeState = atom({
    key: 'themeState',
    default: 'light',
});

const savedLanguage = localStorage.getItem('language') || 'en'; 

export const languageState = atom({
  key: 'languageState', 
  default: savedLanguage, 
});


export const isLoginPageAtom = atom<boolean>({
  key: 'isLoginPage',
  default: false,
});