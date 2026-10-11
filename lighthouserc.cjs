const { BASE } = require('./site.config.mjs'); // require(esm): Node >= 22.12

const base = `${BASE.replace(/\/+$/, '')}/`;
const origin = 'http://localhost:4321';

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'localhost:4321',
      url: [`${origin}${base}`, `${origin}${base}blog/`, `${origin}${base}fr/`],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: { target: 'temporary-public-storage', outputDir: '.lighthouseci' },
  },
};
