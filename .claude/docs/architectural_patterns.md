# Architectural Patterns

Patterns and conventions observed across multiple files in the Raduga Resort codebase.

## 1. Section-Based SPA Layout

Every major content section follows a consistent HTML structure (`index.html`):

```html
<section class="section [id]" id="[id]">
  <div class="container">
    <h2 class="section-title" data-i18n="[key]">Title</h2>
    <div class="rainbow-divider"></div>
    <p class="section-subtitle" data-i18n="[key]">Subtitle</p>
    <!-- Section content -->
  </div>
</section>
```

Examples: rooms (line 109), pricing (line 436), facilities (line 561), questionnaire (line 726), charity (line 843).

Navigation uses hash anchors with smooth scrolling handled in `js/main.js:140-160`.

## 2. Card Component Pattern

All content grids use a consistent card structure across rooms, facilities, tours, and charity sections:

```
.card / .[type]-card
├── .card-image / image container (with CSS hover zoom via transform: scale)
├── .card-badge (optional metadata overlay)
└── .card-body / .card-content
    ├── heading
    ├── description/tagline
    ├── specs/details (optional)
    └── action buttons
```

Styled consistently via `css/style.css` — room cards (line 606), facility cards (line 1115), tour cards (line 1222), charity cards (line 1485).

## 3. Modal System

All modals (room galleries, WhatsApp prompt, lightbox) share the same lifecycle pattern in `js/main.js`:

**Opening:** Add `.active` class, lock body scroll (`document.body.style.overflow = 'hidden'`)
**Closing:** Remove `.active` class, restore scroll (`document.body.style.overflow = ''`)
**Close triggers:** Close button click, overlay click (`e.target.classList.contains('modal-overlay')`), Escape key

Room modals: `js/main.js:190-237`
WhatsApp prompt: `js/main.js:370-387`
Lightbox: `js/main.js:389-408`

CSS modal base styles: `css/style.css:757-909` (rooms), `css/style.css:1758-1822` (lightbox)

## 4. i18n Translation Architecture

Three-layer system:

1. **HTML layer** — Elements marked with `data-i18n` (text content) or `data-i18n-placeholder` (input placeholders) attributes in `index.html`
2. **JSON layer** — Flat-ish key structure using dot notation in `i18n/ru.json`, `i18n/kz.json`, `i18n/en.json`. Keys follow `section.element` pattern (e.g., `rooms.comfort.name`, `pricing.title`)
3. **JS layer** — `setLanguage()` at `js/main.js:34` fetches JSON, iterates `[data-i18n]` elements, resolves nested keys via dot-path traversal. Language persisted to `localStorage` and readable from URL param `?lang=`

The `t(key)` helper function at `js/main.js:26` provides programmatic access to translation values.

## 5. Multi-Step Form State Machine

The questionnaire (`index.html:726-841`, `js/main.js:239-349`) implements a step-based form:

- **State:** `currentStep` integer (1-3), tracked in JS
- **Navigation:** `showStep(n)` toggles `.active` on step containers and progress indicators
- **Validation:** Each step validated before advancing (`js/main.js:271-293`)
- **Submission:** Form data collected into a formatted WhatsApp message string (`js/main.js:296-340`), then opens `wa.me` URL

Progress indicator uses `.step-indicator` elements that receive `.active` class matching the current step.

## 6. CSS Design Token System

All visual properties derive from CSS custom properties defined at `css/style.css:1-49`:

| Category | Variables | Usage |
|----------|-----------|-------|
| Colors | `--color-primary`, `--color-secondary`, `--color-accent` + rainbow set | Buttons, badges, accents |
| Spacing | Inline values (no variables) but consistent scale: 16/20/24/28/32px | Card padding, section gaps |
| Radii | `--radius-sm` (8px) through `--radius-xl` (28px) | Cards, buttons, modals |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-hover` | Elevation system |
| Typography | Google Fonts: Inter (body), Playfair Display (headings) | Set in `:root` |

## 7. Responsive Design Strategy

Three breakpoint tiers in `css/style.css:1837-2035`:

- **1024px** — Collapse grids to 2 columns, reduce font sizes
- **768px** — Single column layouts, show mobile hamburger menu, stack navigation
- **480px** — Minimal padding, smaller typography, full-width elements

Mobile menu toggle implemented at `js/main.js:162-172`. Header gains `.scrolled` class on scroll for visual feedback (`js/main.js:124-138`).

## 8. Animation Pattern

Two animation triggers used consistently:

1. **Scroll-triggered:** Elements with `.fade-in` class get `.visible` added by Intersection Observer (`js/main.js:174-188`). CSS transitions handle the visual effect (`css/style.css:1824-1836`).
2. **CSS-only:** `@keyframes` for continuous animations — `pulse-whatsapp` on floating button (`css/style.css:540-555`), `bounce` on scroll indicator.

## 9. Naming Conventions

| Element | Convention | Examples |
|---------|------------|---------|
| HTML IDs | kebab-case | `#modal-comfort`, `#questionnaire` |
| CSS classes | BEM-inspired kebab-case | `.section-title`, `.btn-primary`, `.card-body` |
| CSS variables | `--category-name` | `--color-primary`, `--shadow-md` |
| JS variables | camelCase | `currentLang`, `heroIndex` |
| JS functions | camelCase verb-first | `initLanguage()`, `openRoomModal()`, `showStep()` |
| JS constants | UPPER_SNAKE_CASE | `WHATSAPP_NUMBER` |
| i18n keys | dot-separated path | `rooms.comfort.name`, `pricing.title` |

## 10. Event Handling Pattern

All event listeners are registered in the `DOMContentLoaded` handler (`js/main.js:10-17`) which calls individual `init*()` functions. Interactive elements use:

- **Direct listeners** for unique elements (language buttons, nav toggle)
- **Delegation** for repeated elements (carousel indicators, modal thumbnails)
- **Inline `onclick`** avoided — all handlers attached in JS

Global keyboard listener for Escape key closes any active modal.
