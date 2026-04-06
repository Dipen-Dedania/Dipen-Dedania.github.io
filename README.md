# Dipen-Dedania.github.io

Personal portfolio and blog site powered by Jekyll and GitHub Pages.

## Quick Setup

### Prerequisites

- Ruby (recommended 3.x)
- Bundler (`gem install bundler`)

### Install

```powershell
bundle install
```

### Run Locally

```powershell
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open [http://127.0.0.1:4000](http://127.0.0.1:4000)

## Content Model

- Home page sections are data-driven via `_data/*.yml`.
- Projects are managed in `_data/projects.yml`.
- Blog listing (`/posts/`) is dynamically loaded from Medium via JavaScript.

## Medium Integration

Medium posts are embedded on the posts page using:

- `posts.html` (container + config)
- `assets/js/medium-posts.js` (fetch + render)

Current Medium handle: `@i_m_vampire_`
