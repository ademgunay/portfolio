import type { Job } from '../lib/types';

export const experience: Job[] = [
  {
    company: 'WYZauto',
    location: 'Bangkok',
    roles: [{ title: 'Lead Frontend Engineer', start: 'Jan 2025', end: 'Present' }],
    highlights: [
      'Led delivery of a large-scale tyre marketplace and expanded it to vehicle spare parts by refactoring the codebase to industry best practices.',
      'Architected a seller-facing CMS for catalog and product management.',
      'Set up the Flutter architecture (Cubit/BLoC, GetIt, local storage) and CI/CD to Google Play and the App Store; mentor the frontend team.',
    ],
  },
  {
    company: 'Pi Securities',
    location: 'Bangkok',
    roles: [
      { title: 'Android Team Lead', start: 'Jul 2023', end: 'Dec 2024' },
      { title: 'Senior Mobile Engineer', start: 'Apr 2023', end: 'Dec 2024' },
    ],
    highlights: [
      "Built and maintained features across the Kotlin and Dart codebases of Pi Financial's Android app.",
      'Refactored technical debt to improve scalability and automated the release process.',
      "Led the Android team: knowledge sharing, PR reviews, technical support to the PO, and the team's growth.",
    ],
  },
  {
    company: 'OOZOU',
    location: 'Bangkok',
    roles: [
      { title: 'Android Team Lead', start: 'Jan 2022', end: 'Apr 2023' },
      { title: 'Android Developer', start: 'Jun 2021', end: 'Apr 2023' },
    ],
    highlights: [
      'Built client apps in Kotlin with Dagger, Coroutines and MVP/MVVM/MVI.',
      'Delivered cross-platform apps in Flutter with GetX.',
      'Mentored developers and supported project managers across the Android team.',
    ],
  },
  {
    company: 'Appsynth',
    location: 'Bangkok',
    roles: [{ title: 'Senior Android Developer', start: 'Nov 2018', end: 'Jun 2021' }],
    highlights: [
      'Shipped apps in Kotlin (Koin, Coroutines, MVVM) and Java (Dagger2, RxJava, MVP).',
      'Used Android Architecture Components (LiveData, Room, ViewModel) and Firebase Auth/Firestore, tested with JUnit and Mockito.',
      'Interviewed Android candidates.',
    ],
  },
  {
    company: 'Freelance',
    location: 'Remote',
    roles: [{ title: 'Android Developer', start: 'Jun 2018', end: 'Sep 2018' }],
    highlights: ['Built Android apps in Kotlin and Java.'],
  },
  {
    company: 'Tricount',
    location: 'Brussels',
    roles: [{ title: 'Full-stack Developer', start: 'Oct 2017', end: 'Feb 2018' }],
    highlights: ['Developed and tested the Java Spring backend and Angular web app; software analysis.'],
  },
];
