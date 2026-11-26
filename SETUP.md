# SanFlash GitHub Profile README

This repository is the public profile repository for the GitHub account `SanFlash`.

## Contents

- `README.md` — profile README.
- `assets/profile-hero.svg` — original midnight-indigo / violet / cyan banner.
- `.github/workflows/snake.yml` — scheduled contribution-snake generator.
- `templates/REPOSITORY_README_TEMPLATE.md` — reusable repository README template.

## Contribution animation

1. Open the repository's Actions tab and enable GitHub Actions if prompted.
2. Run **Generate contribution snake** once using **Run workflow**.
3. The workflow publishes SVGs to the `output` branch.
4. The profile README loads the dark SVG from that branch.

The rest of the profile works while the first animation is being generated.

## GitHub rendering

GitHub README content does not execute arbitrary JavaScript, React, or GSAP. SVG and GIF assets can provide animated visuals; full interactive 3D and GSAP effects belong on the linked portfolio website.

## Content accuracy

Project links point to public SanFlash repositories inspected during preparation. Statistics widgets are supplied by third-party services and may occasionally be rate-limited or unavailable. Language proportions are approximate. Do not treat them as manually verified metrics.


## Interactive experience (GitHub Pages)

The interactive site lives in `experience/` and is deployed by `.github/workflows/pages.yml`.

- The workflow uses GitHub Pages Actions deployment and attempts to enable Pages automatically.
- After the first push, open **Actions → Deploy SanFlash interactive experience** and inspect the deployment run.
- If GitHub requires a one-time repository setting, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
- After a successful deployment, the site URL is: https://sanflash.github.io/SanFlash/

### Interactive features

- Responsive navigation and dark / light theme toggle.
- Live public GitHub profile counters (unauthenticated public API).
- Project search and category filters.
- Copy repository links to clipboard.
- Technology tabs, command palette (`Ctrl/Cmd + K`), and keyboard dismissal.
- Pointer tilt on project cards, animated particles, scroll reveals and GSAP enhancement.
- Reduced-motion support and non-JavaScript fallback content.

The page uses public project links and does not request or store GitHub credentials. Live profile counters depend on GitHub's unauthenticated API rate limits. GSAP is loaded from a CDN; core navigation and filtering do not depend on it.
