import { LANGS as CONFIG_LANGS, DEFAULT_LANG as CONFIG_DEFAULT } from '../../site.config.mjs';

export const LANGS = CONFIG_LANGS;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG = CONFIG_DEFAULT as Lang;
export type Localized<T> = Record<Lang, T>;

export const isLang = (x: string): x is Lang => (LANGS as readonly string[]).includes(x);
export const pick = <T>(v: Localized<T>, lang: Lang): T => v[lang];

const en = {
  'locale.date': 'en-GB',
  'locale.og': 'en_US',
  'lang.short': 'EN',
  'lang.switchLabel': 'English version',
  'lang.toggleAria': 'Language',
  'meta.writingTitle': 'Writing — {name}',
  'meta.writingDescription': 'Articles and notes on Android, Kotlin and Flutter by Adem Gunay.',
  'skip': 'Skip to content',
  'nav.primary': 'Primary',
  'nav.home': '{name}, home',
  'nav.apps': 'Apps',
  'nav.experience': 'Experience',
  'nav.skills': 'Skills',
  'nav.about': 'About',
  'nav.writing': 'Writing',
  'nav.cv': 'CV',
  'nav.menu': 'menu',
  'nav.menuAria': 'Menu',
  'cta.downloadCv': 'Download CV',
  'hero.open': 'Open to opportunities',
  'hero.seeApps': 'See my apps',
  'hero.screensAlt': 'Screens from {apps}',
  'apps.title': "Apps I've built",
  'apps.railAria': 'Apps',
  'apps.screenshotAlt': '{name} app screenshot',
  'store.badgeAria': '{name} on {store} (opens in a new tab)',
  'store.delisted': 'No longer on the stores',
  'store.internal': 'Internal app — not publicly available',
  'experience.present': 'Present',
  'skills.title': 'Skills',
  'about.title': 'About',
  'about.languagesAria': 'Languages',
  'writing.title': 'Writing',
  'writing.all': 'All writing →',
  'writing.external': 'External',
  'writing.inEnglish': 'In English',
  'contact.title': "Let's talk",
  'contact.lead': 'Hiring for a mobile or Flutter lead role, or just want to chat about Android and Flutter? My inbox is open.',
  'contact.copyTitle': 'Copy email address',
  'contact.copyHint': 'Activating this copies the address to your clipboard.',
  'contact.email': 'Email ↗',
  'contact.cv': 'CV ↓',
  'contact.copied': 'Email copied',
  'footer.text': '© {year} {name} · Built with Astro',
} as const;

export type UiKey = keyof typeof en;

const fr: Record<UiKey, string> = {
  'locale.date': 'fr-FR',
  'locale.og': 'fr_FR',
  'lang.short': 'FR',
  'lang.switchLabel': 'Version française',
  'lang.toggleAria': 'Langue',
  'meta.writingTitle': 'Articles — {name}',
  'meta.writingDescription': 'Articles et notes sur Android, Kotlin et Flutter par Adem Gunay.',
  'skip': 'Aller au contenu',
  'nav.primary': 'Principale',
  'nav.home': '{name}, accueil',
  'nav.apps': 'Applis',
  'nav.experience': 'Expérience',
  'nav.skills': 'Compétences',
  'nav.about': 'À propos',
  'nav.writing': 'Articles',
  'nav.cv': 'CV',
  'nav.menu': 'menu',
  'nav.menuAria': 'Menu',
  'cta.downloadCv': 'Télécharger le CV',
  'hero.open': 'Ouvert aux opportunités',
  'hero.seeApps': 'Voir mes applis',
  'hero.screensAlt': 'Écrans de {apps}',
  'apps.title': 'Applis que j’ai développées',
  'apps.railAria': 'Applis',
  'apps.screenshotAlt': 'Capture d’écran de l’appli {name}',
  'store.badgeAria': '{name} sur {store} (s’ouvre dans un nouvel onglet)',
  'store.delisted': 'Plus disponible sur les stores',
  'store.internal': 'Appli interne — non disponible publiquement',
  'experience.present': 'aujourd’hui',
  'skills.title': 'Compétences',
  'about.title': 'À propos',
  'about.languagesAria': 'Langues',
  'writing.title': 'Articles',
  'writing.all': 'Tous les articles →',
  'writing.external': 'Externe',
  'writing.inEnglish': 'En anglais',
  'contact.title': 'Parlons-en',
  'contact.lead': 'Vous recrutez pour un poste de lead mobile ou Flutter, ou vous voulez simplement échanger sur Android et Flutter ? Ma boîte mail est ouverte.',
  'contact.copyTitle': 'Copier l’adresse e-mail',
  'contact.copyHint': 'Cette action copie l’adresse dans votre presse-papiers.',
  'contact.email': 'E-mail ↗',
  'contact.cv': 'CV ↓',
  'contact.copied': 'E-mail copié',
  'footer.text': '© {year} {name} · Réalisé avec Astro',
};

// Every locale must satisfy Record<UiKey, string>: a missing key is a type error.
export const ui: Localized<Record<UiKey, string>> = { en, fr };

export function t(lang: Lang, key: UiKey, vars: Record<string, string | number> = {}): string {
  return ui[lang][key].replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export function formatMonth(lang: Lang, ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return (
    new Intl.DateTimeFormat(t(lang, 'locale.date'), { month: 'short', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(y, m - 1, 1)))
      // Newer ICU renders en-GB September as "Sept"; keep the original 3-letter "Sep".
      .replace(/^Sept\b/, 'Sep')
  );
}
