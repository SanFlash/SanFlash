# SanFlash GitHub Profile README

This repository is the public profile repository for the GitHub account `SanFlash`.

## Contents

- `README.md` — profile README and entry point to the interactive experience.
- `assets/profile-hero.svg` — original midnight-indigo / violet / cyan banner.
- `.github/workflows/snake.yml` — scheduled contribution-snake generator.
- `experience/` — interactive portfolio website source.
- `templates/REPOSITORY_README_TEMPLATE.md` — reusable repository README template.

## Interactive experience deployment

The interactive website is deployed on Vercel from this repository's `main` branch, with `experience/` configured as the project root.

- Live URL: https://sanflash-interactive.vercel.app/
- Vercel project: `sanflash-interactive`
- Git source: `SanFlash/SanFlash` (`main`)
- Future pushes to `experience/` automatically trigger production deployments.

The profile README's **OPEN INTERACTIVE EXPERIENCE** link points to the live Vercel deployment. GitHub Pages is not used for this site.

## Interactive features

- Responsive navigation and dark / light theme toggle.
- Live public GitHub profile counters (unauthenticated public API).
- Project search and category filters.
- Copy repository links to clipboard.
- Technology tabs and command palette (`Ctrl/Cmd + K`).
- Pointer tilt on project cards, animated particles, scroll reveals and GSAP enhancement.
- Reduced-motion support and non-JavaScript fallback content.

The page uses public project links and does not request or store GitHub credentials. Live profile counters depend on GitHub's unauthenticated API rate limits. GSAP is loaded from a CDN; core navigation and filtering do not depend on it.

## Contribution animation

1. Open the repository's Actions tab and enable GitHub Actions if prompted.
2. Run **Generate contribution snake** once using **Run workflow**.
3. The workflow publishes SVGs to the `output` branch.
4. The profile README loads the dark SVG from that branch.

## GitHub rendering

GitHub README content does not execute arbitrary JavaScript, React, or GSAP. SVG and GIF assets can provide animated visuals; full interactive effects belong on the linked Vercel website.

## Content accuracy

Project links point to public SanFlash repositories. Statistics widgets are supplied by third-party services and may occasionally be rate-limited or unavailable. Language proportions are approximate. Do not treat them as manually verified metrics.
