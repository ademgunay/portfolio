import type { SkillGroup } from '../lib/types';

export const skills: SkillGroup[] = [
  { key: 'android', items: ['Kotlin', 'Java', 'Coroutines', 'Dagger/Hilt', 'Koin', 'RxJava', 'Room', 'Jetpack'] },
  { key: 'flutter', items: ['Dart', 'BLoC/Cubit', 'GetIt', 'GetX', 'Flutter Web'] },
  { key: 'architecture', items: ['MVVM', 'MVI', 'MVP', 'Clean Architecture', 'Modularization'] },
  { key: 'delivery', items: ['CI/CD', 'Play Store', 'App Store', 'Git'] },
  { key: 'firebase', items: ['Firestore', 'Auth', 'Cloud Messaging', 'Hosting'] },
  { key: 'testing', items: ['JUnit', 'Mockito'] },
  { key: 'leadership', items: ['Mentoring', 'Technical planning', 'Code review', 'Hiring'] },
];
