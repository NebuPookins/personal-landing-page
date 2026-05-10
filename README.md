# personal-landing-page

A [reveal.js](https://revealjs.com/) presentation used as a personal landing page.

## Quick start

```bash
# Install dependencies
npm install

# Start a dev server with live reload
npm start

# Build for production
npm run build
```

If you just want to view the page without making changes, any static file server will work — the `dist/` directory contains pre-built files:

```bash
python3 -m http.server 8000
# or: npx serve .
```

Open `http://localhost:8000` and press **Space** to navigate.

## Structure

- `index.html` — slide content
- `assets/` — images and other media
- `dist/` — built reveal.js output (pre-generated)
- `src/` — reveal.js source
