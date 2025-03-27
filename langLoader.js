import { useState, useEffect } from 'react';

export function useLang(defaultLang = 'en') {
  const [lang, setLang] = useState(defaultLang);
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('chatterbox-lang') || defaultLang;
    setLang(savedLang);
    
    const loadTranslations = async () => {
      try {
        const langModule = await import(`../langs/${savedLang}.js`);
        setTranslations(langModule.default);
      } catch (error) {
        console.error(`Failed to load language: ${savedLang}`, error);
        // Fallback to English
        if (savedLang !== 'en') {
          const enModule = await import('../langs/en.js');
          setTranslations(enModule.default);
          setLang('en');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, [defaultLang]);

  const changeLang = async (newLang) => {
    try {
      setIsLoading(true);
      const langModule = await import(`../langs/${newLang}.js`);
      setTranslations(langModule.default);
      setLang(newLang);
      localStorage.setItem('chatterbox-lang', newLang);
    } catch (error) {
      console.error(`Failed to load language: ${newLang}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key) => {
    return translations[key] || key;
  };

  return { lang, changeLang, t, isLoading };
}
