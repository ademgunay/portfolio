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

## CI

The workflow lives in `.github/workflows/deploy.yml`.

- Every pull request runs the `test` job: type check, unit tests, build, Playwright e2e and Lighthouse budgets.
- A push to `main` runs `test` first, then `build-pages` and `deploy` publish the site to GitHub Pages. If `test` fails, nothing is deployed.
- Recommended: add a branch protection rule on `main` that requires the `test` status check (Settings → Branches). This is free for public repos.

One-time setup:

1. Make the repository public.
2. Settings → Pages → Source: GitHub Actions.

## Custom domain (gunayadem.dev)

1. `astro.config.mjs`: `site: 'https://gunayadem.dev'`, `base: '/'`.
2. Add `public/CNAME` containing `gunayadem.dev`.
3. Point DNS at GitHub Pages and set the domain in repo Settings → Pages.

## To do (Adem)

- Replace `public/cv.pdf` (currently the LinkedIn export) with the real CV.
- Replace any `placeholder.png` app screenshots.
- Optionally add a photo: import it in `profile.ts` as `photo`.
