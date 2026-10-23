# sufi portfolio

A static React + TypeScript portfolio built with Vite, Tailwind CSS, Framer Motion, and lucide-react. It is ready to deploy to Netlify and contains no backend.

## Edit the content

Update `src/config/site.ts` to change the name, professional title, location, email, WhatsApp number, domain, social links, project list, technology tags, demo/source URLs, and starting prices. Project names and descriptions live in `src/i18n/translations.ts` under each locale's `portfolio.projects`; add a matching translation entry when adding a project ID. Pricing labels and descriptions are in the same translation file under `pricing.items`.

All interface copy is in `src/i18n/translations.ts`. It includes English, Indonesian, Spanish, Portuguese, German, French, Arabic (RTL), and Japanese. Update every locale when changing or adding interface text.

Replace the concept project artwork in `public/images/` with real work before launch, and update each URL in the config. The included previews are explicitly marked as concept placeholders; demo and source URLs currently point to example placeholders. Replace `baseUrl` in the config and the matching domain in `index.html`, `public/robots.txt`, and `public/sitemap.xml` with your deployed domain.

## Run locally

```sh
npm install
npm run dev
```

## Deploy to Netlify

Connect the repository to Netlify. `netlify.toml` configures `npm run build`, publishes `dist`, and includes an SPA fallback. The contact form is Netlify Forms compatible; enable form notifications in the Netlify dashboard after the first deploy. A hidden static form in `index.html` lets Netlify detect submissions, while the visible form includes native required-field and email validation, a honeypot, and a post-submit success state.

The visitor greeting and country-based language fallback use `ipwho.is` with a short timeout. Visitors can always choose a language manually; their choice is saved in local storage.