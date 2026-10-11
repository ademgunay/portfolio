import type { SkillGroup } from '../lib/types';

const same = (items: string[]) => ({ en: items, fr: items });

export const skills: SkillGroup[] = [
  { key: 'android', items: same(['Kotlin', 'Java', 'Coroutines', 'Dagger/Hilt', 'Koin', 'RxJava', 'Room', 'Jetpack']) },
  { key: 'flutter', items: same(['Dart', 'BLoC/Cubit', 'GetIt', 'GetX', 'Flutter Web']) },
  {
    key: 'architecture',
    items: {
      en: ['MVVM', 'MVI', 'MVP', 'Clean Architecture', 'Modularization'],
      fr: ['MVVM', 'MVI', 'MVP', 'Clean Architecture', 'Modularisation'],
    },
  },
  { key: 'delivery', items: same(['CI/CD', 'Play Store', 'App Store', 'Git']) },
  { key: 'firebase', items: same(['Firestore', 'Auth', 'Cloud Messaging', 'Hosting']) },
  { key: 'testing', items: same(['JUnit', 'Mockito']) },
  {
    key: 'leadership',
    items: {
      en: ['Mentoring', 'Technical planning', 'Code review', 'Hiring'],
      fr: ['Mentorat', 'Planification technique', 'Revue de code', 'Recrutement'],
    },
  },
];
