import { useLanguage } from '../contexts/LanguageContext';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        variant={lang === 'en' ? 'contained' : 'outlined'}
        onClick={() => setLang('en')}
        size="small"
      >
        EN
      </Button>
      <Button
        variant={lang === 'fr' ? 'contained' : 'outlined'}
        onClick={() => setLang('fr')}
        size="small"
      >
        FR
      </Button>
    </Stack>
  );
};

export default LanguageSwitcher;
