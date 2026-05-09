# Sajid Kiani — Portfolio

Personal cybersecurity portfolio site. Built as a single-file static HTML with Three.js 3D particle background, GSAP scroll animations, and zero build dependencies.

## Deploy to GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `sajidkiani.github.io` for user page, or any repo name for project page)
2. Push this folder to the `main` branch
3. In repo Settings → Pages → set Source to **Deploy from a branch** → `main` → `/ (root)`
4. Site will be live at `https://yourusername.github.io` (or `https://yourusername.github.io/reponame/` for project pages)

## Custom Domain (optional)

Create a `CNAME` file in this folder with your domain:
```
yourdomain.com
```
Then configure your DNS as per GitHub Pages docs.

## Security implemented

- `X-Content-Type-Options: nosniff` (via meta)
- `X-Frame-Options: DENY` (via meta + JS frame-busting)
- `Referrer-Policy: strict-origin-when-cross-origin` (via meta)
- Content Security Policy (via meta): restricts scripts/styles to self + specific CDNs, no eval, no inline eval
- All external links use `rel="noopener noreferrer"` (prevents tab-napping)
- No form submissions, no user input — static read-only
- No cookies, no local storage, no session data
- Frame-busting JS as defense-in-depth alongside CSP frame-src: none

## Note on server-side headers

GitHub Pages does not support custom HTTP response headers (like a `_headers` file — that's Netlify). For stronger header enforcement, deploy to **Netlify** or **Cloudflare Pages** instead, and add a `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';
```

## Structure

```
portfolio/
├── index.html          # Complete site (self-contained)
├── _config.yml         # GitHub Pages config
└── README.md
```

## Customization

All content is in `index.html`. Search for these comments to find editable sections:
- `HERO` — name, tagline, stats
- `ABOUT / CV` — bio, terminal block, achievements
- `EXPERIENCE` — career timeline
- `SKILLS` — skill tags
- `WRITEUPS` — article cards with links
- `CONTACT` — contact links
