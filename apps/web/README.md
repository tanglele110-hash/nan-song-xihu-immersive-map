# Web Wrapper

`apps/web` is the Vite wrapper for the confirmed desktop MVP demo in `app/`.

It must serve `app/index.html`, `app/styles.css`, and `app/main.js` unchanged as the current frontend experience baseline. Do not add a framework runtime here unless a future migration is explicitly approved and validated against the demo with visual and interaction regression checks.

`app/content-data.js` is a generated bridge from `content/` into the legacy runtime. `app/app-api.js` optionally replaces that data from `GET /api/v1/app-content` when the page is opened with `?api=1`; otherwise it immediately loads `app/main.js` with static data. Both files should be checked with `npm run validate:content`.

Production build copies `app/content-data.js`, `app/app-api.js`, `app/main.js`, and `app/assets/` into `apps/web/dist/app/`.
