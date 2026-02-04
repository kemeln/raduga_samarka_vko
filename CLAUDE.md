# Raduga Resort - Samarka, VKO

Marketing and booking website for a family vacation resort on Lake Sarybel, East Kazakhstan. Static single-page site with multilingual support (RU/KZ/EN), room showcases, seasonal pricing, a multi-step booking questionnaire, and WhatsApp-based lead capture.

## Tech Stack

- **HTML5** - Single-page structure (`index.html`, 996 lines)
- **CSS3** - Custom properties, flexbox, grid, animations (`css/style.css`, 2104 lines)
- **Vanilla JavaScript (ES6+)** - No frameworks (`js/main.js`, 415 lines)
- **i18n via JSON** - Three language files in `i18n/` (ru.json, kz.json, en.json)
- **No build step** - Serve as static files

## Project Structure

```
index.html          # Entire site (SPA with anchor-based navigation)
css/style.css       # All styles, design tokens, responsive breakpoints
js/main.js          # All behavior: i18n, carousel, modals, forms, WhatsApp
i18n/               # Translation JSON files (ru, kz, en)
content/images/     # Organized by category: hero/, comfort/, comfort-plus/, vip/, facilities/, charity/
images/             # Logo and shared assets
```

## Key Sections in index.html

| Section        | Lines     | Purpose                                    |
|----------------|-----------|---------------------------------------------|
| Header/Nav     | 21-46     | Fixed nav bar, language switcher             |
| Hero Carousel  | 48-76     | Auto-rotating images with indicators         |
| Rooms          | 109-434   | 3 room types with modal galleries            |
| Pricing        | 436-559   | Seasonal pricing table, inclusions           |
| Facilities     | 561-678   | Grid of 9 amenities                          |
| Questionnaire  | 726-841   | 3-step booking form                          |
| Modals/UI      | 970-991   | WhatsApp prompt, lightbox                    |

## Key Modules in js/main.js

| Module            | Lines     | Purpose                                |
|-------------------|-----------|----------------------------------------|
| Language System   | 19-79     | i18n loading, `data-i18n` attribute translation, localStorage persistence |
| Hero Carousel     | 81-122    | Auto-advance (5s), indicator dots       |
| Room Modals       | 190-237   | Gallery modals, thumbnail switching     |
| Questionnaire     | 239-349   | Multi-step form, validation, WhatsApp message generation |
| WhatsApp          | 351-387   | Direct messaging with pre-formatted text |

## Design Tokens (css/style.css:1-49)

Colors: `--color-primary` (#E8623A), `--color-secondary` (#4CAF50), `--color-accent` (#F4A940)
Border radii: `--radius-sm` (8px) through `--radius-xl` (28px)
Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
Breakpoints: 1024px, 768px, 480px

## Serving Locally

```bash
python -m http.server 8000
# or
npx http-server
```

## i18n Workflow

1. Add `data-i18n="section.key"` attribute to HTML element (`index.html`)
2. Add corresponding key to all three files: `i18n/ru.json`, `i18n/kz.json`, `i18n/en.json`
3. For placeholders use `data-i18n-placeholder="section.key"`
4. The `setLanguage()` function in `js/main.js:34` handles applying translations

## WhatsApp Integration

All booking CTAs route through WhatsApp. The number is defined at `js/main.js:1` (`WHATSAPP_NUMBER`). The questionnaire builds a formatted message at `js/main.js:296-340` before opening wa.me.

## Additional Documentation

When working on specific areas, consult:

- [Architectural Patterns](.claude/docs/architectural_patterns.md) - Component patterns, modal system, form state machine, i18n architecture, and conventions used across the codebase

## Adding New Features or Fixing Bugs

**IMPORTANT**: When you work on a new feature or bug, crate a git branch first. Then work on changes in that branch for the remainder of the session.

