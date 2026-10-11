# Adem Gunay — Portfolio

Personal portfolio built with Astro 7, Tailwind 4 and GSAP. Deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/portfolio/
npm test           # unit tests (Vitest)
npm run e2e        # end-to-end tests (Playwright, builds first)
```

## Edit content

| What | Where |
|---|---|
| Name, tagline, links, bio, languages, "open to opportunities" | `src/content/profile.ts` |
| Jobs | `src/content/experience.ts` |
| Skills | `src/content/skills.ts` |
| Featured apps (one file each) | `src/content/apps/*.md` + screenshots in `src/assets/apps/<slug>/` |
| Writing | `src/content/blog/*.md` — set `externalUrl` + `publisher` to link out, omit for a local post |
| CV | `public/cv.pdf` |

New post: copy `src/content/blog/example-draft.md`, rename, set `draft: false`.

## Languages

English lives at `/portfolio/`, French at `/portfolio/fr/`. The nav toggle switches between them and keeps the current section.

- Interface text: `src/i18n/ui.ts` (one block per language; a missing key fails the type check and unit tests).
- Content: fields shaped `{ en: …, fr: … }` in `src/content/profile.ts`, `experience.ts`, `skills.ts`, and `role` / `period` / `story` in each `src/content/apps/*.md`.
- French CV: set `cvPathFr: '/cv-fr.pdf'` in `profile.ts` and add the file to `public/`.

### Adding a language (e.g. German)
1. `site.config.mjs`: `LANGS = ['en', 'fr', 'de']`.
2. `src/i18n/ui.ts`: add a `de` block (the type check lists every missing key).
3. Add `de` values to every `{ en, fr }` field and app frontmatter (the build fails until all exist).
Pages (`/de/`, `/de/blog/`), hreflang tags and the toggle are generated automatically.

## CI

The workflow lives in `.github/workflows/deploy.yml`.

- Every pull request runs the `test` job: type check, unit tests, build, Playwright e2e and Lighthouse budgets.
- A push to `main` runs `test` first, then `build-pages` and `deploy` publish the site to GitHub Pages. If `test` fails, nothing is deployed.
- Recommended: add a branch protection rule on `main` that requires the `test` status check (Settings → Branches). This is free for public repos.

One-time setup:

1. Make the repository public.
2. Settings → Pages → Source: GitHub Actions.

## Custom domain (gunayadem.dev)

1. Edit `site.config.mjs`: `SITE = 'https://gunayadem.dev'`, `BASE = '/'`. Astro, Playwright and Lighthouse CI all read it, so nothing else needs changing.
2. Add `public/CNAME` containing `gunayadem.dev`.
3. Point DNS at GitHub Pages and set the domain in repo Settings → Pages.

## To do (Adem)

- Replace `public/cv.pdf` (currently the LinkedIn export) with the real CV.
- Replace any `placeholder.png` app screenshots.
- Optionally add a photo: import it in `profile.ts` as `photo`.
