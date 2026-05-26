import i18next from 'i18next';

import cs from './locales/cs.yaml';
import da from './locales/da.yaml';
import de from './locales/de.yaml';
import el from './locales/el.yaml';
import en from './locales/en.yaml';
import es from './locales/es.yaml';
import fi from './locales/fi.yaml';
import fr from './locales/fr.yaml';
import hu from './locales/hu.yaml';
import it from './locales/it.yaml';
import nb from './locales/nb.yaml';
import nl from './locales/nl.yaml';
import pl from './locales/pl.yaml';
import rm from './locales/rm.yaml';
import sk from './locales/sk.yaml';
import sv from './locales/sv.yaml';

function getLanguageCodeFromLocale(locale: string) {
  const [language, _region] = locale.split('-');
  return language;
}

const detectedLang = getLanguageCodeFromLocale(navigator.language);

await i18next.init({
  lng: detectedLang,
  fallbackLng: 'en',
  // YAML files use flat dot-notation keys, not nested objects
  keySeparator: false,
  resources: {
    cs: { translation: cs },
    da: { translation: da },
    de: { translation: de },
    el: { translation: el },
    en: { translation: en },
    es: { translation: es },
    fi: { translation: fi },
    fr: { translation: fr },
    hu: { translation: hu },
    it: { translation: it },
    nb: { translation: nb },
    nl: { translation: nl },
    pl: { translation: pl },
    rm: { translation: rm },
    sk: { translation: sk },
    sv: { translation: sv },
  },
});

export default i18next;
