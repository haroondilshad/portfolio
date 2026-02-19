# Portfolio Project

Hugo static site using the PaperMod theme. Deployed to haroondilshad.com.

## Structure

- `content/` — Markdown pages (experience, portfolio, blog)
- `hugo.toml` — Site config, navigation, profile, metadata
- `themes/PaperMod/` — Git submodule, do not edit directly
- `github-readme/` — Git submodule for the GitHub profile README (`haroondilshad/haroondilshad`)
- `layouts/` — Template overrides on top of PaperMod
- `static/` — Favicon, images, Decap CMS admin

## Submodules

Two submodules are tracked in `.gitmodules`:
1. `themes/PaperMod` — Hugo theme (upstream, read-only)
2. `github-readme` — GitHub profile README (owned, editable)

When updating `github-readme`, commit and push inside the submodule first, then commit the updated ref in the parent repo.

## Dev Server

```
hugo server -D --port 1313
```

Requires Hugo extended edition (v0.156+).

## Key Details

- Package manager: pnpm (if Node dependencies are ever added)
- Experience/bio text appears in three places: `content/experience/_index.md`, `github-readme/README.md`, and `hugo.toml` — keep them in sync
- The `content/_index.md` homepage also references years of experience and title
