import type { Profile } from '../lib/types';

export const profile: Profile = {
  name: 'Adem Gunay',
  title: { en: 'Lead Frontend Engineer · Android & Flutter', fr: 'Lead Frontend Engineer · Android & Flutter' },
  tagline: {
    en: 'I build mobile apps people enjoy using — and lead the teams that ship them.',
    fr: 'Je crée des applis mobiles que l’on prend plaisir à utiliser — et je dirige les équipes qui les livrent.',
  },
  location: { en: 'Bangkok, Thailand', fr: 'Bangkok, Thaïlande' },
  email: 'gunayadem.dev@gmail.com',
  summary: {
    en: 'Adem Gunay — Lead Frontend Engineer in Bangkok. 8+ years building Android (Kotlin, Java) and Flutter apps for finance, retail, healthcare and automotive.',
    fr: 'Adem Gunay — Lead Frontend Engineer à Bangkok. Plus de 8 ans à développer des applis Android (Kotlin, Java) et Flutter pour la finance, le commerce, la santé et l’automobile.',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/adem-gunay',
    github: 'https://github.com/ademgunay',
    medium: 'https://medium.com/@gunayadem.dev',
  },
  languages: [
    { name: { en: 'English', fr: 'Anglais' }, level: { en: 'Native', fr: 'Langue maternelle' } },
    { name: { en: 'French', fr: 'Français' }, level: { en: 'Native', fr: 'Langue maternelle' } },
    { name: { en: 'Turkish', fr: 'Turc' }, level: { en: 'Native', fr: 'Langue maternelle' } },
    { name: { en: 'Dutch', fr: 'Néerlandais' }, level: { en: 'Limited working', fr: 'Notions professionnelles' } },
  ],
  cvPath: '/cv.pdf',
  openToOpportunities: false,
  bio: {
    en: [
      "I didn't start in software. Before my degree I spent two and a half years as a CNC machine operator at SABCA in Belgium — reading plans, cutting parts, and learning that precision and process matter.",
      'I went on to study Computer Software Engineering at ULB in Brussels, then worked full-stack (Java Spring + Angular) at Tricount before moving to Bangkok and into mobile.',
      "Since 2018 I've shipped Android and Flutter apps for retail, healthcare, finance and automotive, and grown from developer to team lead. I care about clean architecture, fast feedback loops, and UX that feels effortless.",
    ],
    fr: [
      'Je n’ai pas commencé dans le logiciel. Avant mes études, j’ai passé deux ans et demi comme opérateur sur machine CNC chez SABCA en Belgique — à lire des plans, découper des pièces et apprendre que la précision et la méthode comptent.',
      'J’ai ensuite étudié l’ingénierie logicielle à l’ULB à Bruxelles, puis travaillé en full-stack (Java Spring + Angular) chez Tricount avant de m’installer à Bangkok et de me tourner vers le mobile.',
      'Depuis 2018, je livre des applis Android et Flutter pour le commerce, la santé, la finance et l’automobile, et je suis passé de développeur à lead d’équipe. Je tiens à une architecture propre, à des boucles de feedback rapides et à une UX qui paraît naturelle.',
    ],
  },
};
