import type { Job } from '../lib/types';

const same = (s: string) => ({ en: s, fr: s });

export const experience: Job[] = [
  {
    company: 'WYZauto',
    location: same('Bangkok'),
    roles: [{ title: same('Lead Frontend Engineer'), start: '2025-01' }],
    highlights: {
      en: [
        'Led delivery of a large-scale tyre marketplace and expanded it to vehicle spare parts by refactoring the codebase to industry best practices.',
        'Architected a seller-facing CMS for catalog and product management.',
        'Set up the Flutter architecture (Cubit/BLoC, GetIt, local storage) and CI/CD to Google Play and the App Store; mentor the frontend team.',
      ],
      fr: [
        'Pilotage de la livraison d’une marketplace de pneus à grande échelle, étendue aux pièces détachées automobiles grâce à une refonte du code selon les bonnes pratiques du secteur.',
        'Conception d’un CMS côté vendeurs pour la gestion du catalogue et des produits.',
        'Mise en place de l’architecture Flutter (Cubit/BLoC, GetIt, stockage local) et du CI/CD vers Google Play et l’App Store ; mentorat de l’équipe frontend.',
      ],
    },
  },
  {
    company: 'Pi Securities',
    location: same('Bangkok'),
    roles: [
      { title: { en: 'Android Team Lead', fr: 'Lead de l’équipe Android' }, start: '2023-07', end: '2024-12' },
      { title: { en: 'Senior Mobile Engineer', fr: 'Ingénieur mobile senior' }, start: '2023-04', end: '2024-12' },
    ],
    highlights: {
      en: [
        "Built and maintained features across the Kotlin and Dart codebases of Pi Financial's Android app.",
        'Refactored technical debt to improve scalability and automated the release process.',
        "Led the Android team: knowledge sharing, PR reviews, technical support to the PO, and the team's growth.",
      ],
      fr: [
        'Développement et maintenance de fonctionnalités dans les bases de code Kotlin et Dart de l’appli Android Pi Financial.',
        'Réduction de la dette technique pour améliorer la scalabilité et automatisation du processus de release.',
        'Direction de l’équipe Android : partage de connaissances, revues de PR, support technique au PO et accompagnement de l’équipe.',
      ],
    },
  },
  {
    company: 'OOZOU',
    location: same('Bangkok'),
    roles: [
      { title: { en: 'Android Team Lead', fr: 'Lead de l’équipe Android' }, start: '2022-01', end: '2023-04' },
      { title: { en: 'Android Developer', fr: 'Développeur Android' }, start: '2021-06', end: '2023-04' },
    ],
    highlights: {
      en: [
        'Built client apps in Kotlin with Dagger, Coroutines and MVP/MVVM/MVI.',
        'Delivered cross-platform apps in Flutter with GetX.',
        'Mentored developers and supported project managers across the Android team.',
      ],
      fr: [
        'Développement d’applis clients en Kotlin avec Dagger, Coroutines et MVP/MVVM/MVI.',
        'Livraison d’applis multiplateformes en Flutter avec GetX.',
        'Mentorat des développeurs et soutien aux chefs de projet au sein de l’équipe Android.',
      ],
    },
  },
  {
    company: 'Appsynth',
    location: same('Bangkok'),
    roles: [{ title: { en: 'Senior Android Developer', fr: 'Développeur Android senior' }, start: '2018-11', end: '2021-06' }],
    highlights: {
      en: [
        'Shipped apps in Kotlin (Koin, Coroutines, MVVM) and Java (Dagger2, RxJava, MVP).',
        'Used Android Architecture Components (LiveData, Room, ViewModel) and Firebase Auth/Firestore, tested with JUnit and Mockito.',
        'Interviewed Android candidates.',
      ],
      fr: [
        'Livraison d’applis en Kotlin (Koin, Coroutines, MVVM) et Java (Dagger2, RxJava, MVP).',
        'Utilisation des Android Architecture Components (LiveData, Room, ViewModel) et de Firebase Auth/Firestore, tests avec JUnit et Mockito.',
        'Entretiens de recrutement de candidats Android.',
      ],
    },
  },
  {
    company: 'Freelance',
    location: { en: 'Remote', fr: 'À distance' },
    roles: [{ title: { en: 'Android Developer', fr: 'Développeur Android' }, start: '2018-06', end: '2018-09' }],
    highlights: { en: ['Built Android apps in Kotlin and Java.'], fr: ['Développement d’applis Android en Kotlin et Java.'] },
  },
  {
    company: 'Tricount',
    location: { en: 'Brussels', fr: 'Bruxelles' },
    roles: [{ title: { en: 'Full-stack Developer', fr: 'Développeur full-stack' }, start: '2017-10', end: '2018-02' }],
    highlights: {
      en: ['Developed and tested the Java Spring backend and Angular web app; software analysis.'],
      fr: ['Développement et tests du backend Java Spring et de l’appli web Angular ; analyse logicielle.'],
    },
  },
];
