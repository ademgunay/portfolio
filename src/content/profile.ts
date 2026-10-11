import type { Profile } from '../lib/types';

export const profile: Profile = {
  name: 'Adem Gunay',
  title: 'Lead Frontend Engineer · Android & Flutter',
  tagline: 'I build mobile apps people enjoy using — and lead the teams that ship them.',
  location: 'Bangkok, Thailand',
  email: 'gunayadem.dev@gmail.com',
  summary:
    'Adem Gunay — Lead Frontend Engineer in Bangkok. 8+ years building Android (Kotlin, Java) and Flutter apps for finance, retail, healthcare and automotive.',
  links: {
    linkedin: 'https://www.linkedin.com/in/adem-gunay',
    github: 'https://github.com/ademgunay',
    medium: 'https://medium.com/@gunayadem.dev',
  },
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'French', level: 'Native' },
    { name: 'Turkish', level: 'Native' },
    { name: 'Dutch', level: 'Limited working' },
  ],
  cvPath: '/cv.pdf',
  openToOpportunities: false,
  bio: [
    "I didn't start in software. Before my degree I spent two and a half years as a CNC machine operator at SABCA in Belgium — reading plans, cutting parts, and learning that precision and process matter.",
    'I went on to study Computer Software Engineering at ULB in Brussels, then worked full-stack (Java Spring + Angular) at Tricount before moving to Bangkok and into mobile.',
    "Since 2018 I've shipped Android and Flutter apps for retail, healthcare, finance and automotive, and grown from developer to team lead. I care about clean architecture, fast feedback loops, and UX that feels effortless.",
  ],
};
