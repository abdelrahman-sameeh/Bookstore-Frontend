import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Load the language from localStorage when the component mounts
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'; // Default to 'en' if no saved language
    i18n.changeLanguage(savedLanguage);
    document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr'); // Set text direction
    document.body.classList.toggle('ltr', savedLanguage === 'en');
    document.body.classList.toggle('rtl', savedLanguage === 'ar');
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // Save the selected language to localStorage
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr'); // Set text direction
    document.body.classList.toggle('ltr', lng === 'en');
    document.body.classList.toggle('rtl', lng === 'ar');
  };

  return (
    <div className="btn-group">
      <button onClick={() => changeLanguage('en')} className="btn btn-secondary border">
        En
      </button>
      <button onClick={() => changeLanguage('ar')} className="btn btn-secondary border">
        ع
      </button>
    </div>
  );
};

export default LanguageSwitcher;
