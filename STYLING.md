# Styling migration plan

## Goal

Consolidate component-owned CSS into Svelte `<style>` blocks and establish one
authoritative token layer named **design tokens**. The end state should have a
clear boundary:

- `src/styles/design-tokens.css` — global design tokens only: colour roles,
  typography, spacing, radii, shadows, breakpoints, and component-independent
  dimensions. This is the branded **design tokens** location.
- `src/styles/global.css` — the sole global stylesheet entry point. It imports
  Tailwind and design tokens, then contains reset/base/document rules only.
- Component and route `.svelte` files — scoped `<style>` blocks for static
  styles owned by that component or route.
- Tailwind — retained only during migration, then either deliberately kept for
  small layout utilities or removed in a separate decision. Do not mix a
  Tailwind utility implementation and a local-CSS implementation for the same
  component.

## Progress

## Migration status

The styling migration is complete for static styles:

- Added `src/styles/design-tokens.css` and imported it from the active global
  entry point. It exposes semantic tokens while retaining legacy aliases for a
  behaviour-preserving incremental migration.
- Removed the duplicated, unreferenced split stylesheets under `src/styles/`.
- Migrated the static inline declarations from the low-effort files to local
  classes and scoped `<style>` blocks.
- Added a `classes` API to `Select.svelte` so route-owned select adjustments
  no longer need an inline `style` prop.
- Completed the medium-effort shared layout, navigation, authentication, modal,
  route, and reusable-card migration work.
- Removed the unreferenced `src/app.css`, `static/global.css`, and legacy
  Tailwind configuration after confirming they have no application references.

The remaining inline declarations are intentional runtime styling in Pokémon
presentation components. They express data- or state-dependent colours,
geometry, and active states; replacing them with static CSS would lose that
behaviour. Future work should prefer Svelte-set CSS custom properties over
string-built `style` values when touching those components.

## Current state

- `src/styles/global.css` is the active global entry point, imported by
  `src/routes/+layout.svelte`.
- It duplicates the contents and purpose of several currently unreferenced
  files under `src/styles/`, while `src/app.css` defines a second, competing
  token set and imports Tailwind again.
- `static/global.css` contains another legacy global/component layer. It is not
  imported by the application, so it must be confirmed as obsolete before
  deletion.
- Tailwind v4 is installed and utilities are used broadly. `tailwind.config.js`
  has a legacy-style colour extension and duplicates the CSS-variable layer;
  validate its effect before relying on it as an authority.
- 43 Svelte files have local `<style>` blocks, while 44 have inline `style=`
  attributes. Many also use global classes (`card`, `button`, `columns`,
  `h1`–`h4`) and Tailwind utilities.

## Design tokens

Create `src/styles/design-tokens.css` first and import it once from
`src/styles/global.css`. Use semantic aliases in components, not light/dark or
raw values:

```css
/* design tokens */
:root {
	--color-surface: ...;
	--color-surface-raised: ...;
	--color-text: ...;
	--color-text-inverse: ...;
	--color-accent: ...;
	--color-danger: ...;
	--space-1: ...;
	--radius-1: ...;
	--shadow-interactive: ...;
	--breakpoint-md: 48rem;
}

.dark-theme {
	/* semantic values only */
}
```

Initially preserve the existing values exactly. Map the existing aliases
(`--red-accent`, `--card-background`, `--select-background`, `--text`, etc.) to
the new semantic names, then remove compatibility aliases only after consumers
are migrated. Token candidates include duplicated colours in `src/app.css`,
`src/styles/colours.css`, `src/styles/global.css`, `brands.css`, local component
styles, and repeated 5/10px, 0.5/1/2rem, 768px, 10px radius, and shadow values.

## Migration sequence

1. Introduce `design-tokens.css`; make `global.css` the one entry point and
   preserve rendering with compatibility aliases.
2. Move base styles (font loading, element defaults, accessibility/focus rules,
   document layout) into `global.css`. Keep these global; they do not belong in
   Svelte component styles.
3. Migrate UI atoms and shared molecules to scoped styles, replacing global
   `card`, `button`, `select`, and `columns` rules with explicit component
   classes. Update their consumers before deleting global classes.
4. Migrate routes and feature components, replacing static inline declarations
   with classes plus local `<style>` blocks. Replace repeated literals with
   tokens.
5. Decide Tailwind's permanent role, remove duplicate utility/CSS rules, then
   delete unreferenced legacy files and the redundant Tailwind import/config.
6. For each batch, run `npm run check` (or the project’s equivalent), visually
   compare light/dark and mobile/desktop states, and search for obsolete global
   class names and raw values.

## Areas that are less straightforward

- **Dynamic style values must remain dynamic.** `PokemonCard.svelte` uses
  runtime type/gender colours and geometry; use CSS custom properties set from
  Svelte or an intentionally narrow `style:` directive, not a static style
  block.
- **Props forwarding and external classes.** `Card.svelte`, `Button.svelte`,
  `Image.svelte`, `Icon.svelte`, and `Select.svelte` accept classes/styles or
  are used throughout the app. Their API and style scoping must be migrated
  before callers.
- **Global selectors are intentional in a few places.** font setup, `body`,
  form control defaults, shared headings, theme switching, and third-party
  sign-in branding need a global/imported layer rather than a scoped style.
- **Responsive duplication.** 768px appears in global styles and components;
  CSS custom properties cannot currently be used directly in media queries in
  all target browsers. Standardise the literal breakpoint or use a build-time
  custom-media solution, rather than promising a CSS variable replacement.
- **Historical privacy-policy routes** are duplicated pages. Treat their local
  styles as low-risk but keep their rendered appearance version-accurate.
- **`static/global.css` and unused split files** may be referenced outside the
  source tree (deployment templates or old embeds). Confirm with a production
  asset check before deleting them.

## File-by-file effort

Effort includes migration risk, not just line count. “Local” means move static
rules to a scoped `<style>` block; “global” means retain/rehome in the global
layer; “review” means confirm or remove rather than migrate.

### Global configuration and styles

| File                                 | Effort | Plan                                                                                                                               |
| ------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/design-tokens.css` (new) | Medium | Create the authoritative **design tokens** layer; preserve current values via semantic aliases.                                    |
| `src/styles/global.css`              | High   | Split its tokens into design tokens and keep only base/reset/document rules; remove duplicated imports and legacy component rules. |
| `src/app.css`                        | Medium | Merge or delete after checking for external import; it is a conflicting, apparently unused token layer.                            |
| `static/global.css`                  | Medium | Review as a potentially externally served legacy stylesheet; remove only after production/reference confirmation.                  |
| `src/styles/colours.css`             | Low    | Supersede with design tokens; currently unreferenced.                                                                              |
| `src/styles/fonts.css`               | Low    | Fold font and heading definitions into the single global entry point; currently unreferenced.                                      |
| `src/styles/elements.css`            | Low    | Fold generic form rules into global base styles; currently unreferenced.                                                           |
| `src/styles/layout.css`              | Low    | Fold or replace its legacy layout helpers; currently unreferenced.                                                                 |
| `src/styles/helpers.css`             | Low    | Fold visibility helpers into global base styles or replace usages locally; currently unreferenced.                                 |
| `src/styles/states.css`              | Low    | Move button state rules into `Button.svelte`; currently unreferenced.                                                              |
| `src/styles/tailwind.css`            | Low    | Remove as an unused duplicate Tailwind entry after the Tailwind decision.                                                          |
| `src/routes/auth/signin/brands.css`  | Medium | Keep as a shared imported auth-brand stylesheet or move the common class to the sign-in route; move GitHub colours to tokens.      |
| `tailwind.config.js`                 | Medium | Reconcile with Tailwind v4 and design-token names; avoid maintaining duplicate colour authorities.                                 |

### UI primitives and shared components

| File                                                       | Effort | Plan                                                                                                       |
| ---------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| `src/ui/atoms/Button.svelte`                               | High   | Centralise button variants/states locally; replace global `.button` and `.error` dependencies with tokens. |
| `src/ui/atoms/Card.svelte`                                 | High   | Centralise card surface/interactive variants locally; migrate callers from global `.card`.                 |
| `src/ui/atoms/Select.svelte`                               | High   | Move global select styling into the atom while preserving native control and focus behaviour.              |
| `src/ui/atoms/Image.svelte`                                | Medium | Move image/loading styles locally; keep consumer sizing classes explicit.                                  |
| `src/ui/atoms/Icon.svelte`                                 | Medium | Consolidate its multiple style blocks; retain runtime dimensions/fill as CSS variables where needed.       |
| `src/ui/molecules/Modal/Modal.svelte`                      | Medium | Keep overlay/dialog rules scoped and tokenise elevation, surfaces, and spacing.                            |
| `src/ui/molecules/pokemon/card/PokemonCardEntry.svelte`    | High   | Replace five static inline rules and tokenise card layout; preserve data-derived styles.                   |
| `src/ui/molecules/pokemon/list/PokemonListEntry.svelte`    | High   | Replace seven inline rules with local classes and tokenise list spacing.                                   |
| `src/ui/molecules/move/list/MoveListEntry.svelte`          | Medium | Move static inline sizing/alignment to local classes.                                                      |
| `src/ui/molecules/tags/EditTag.svelte`                     | Low    | Replace the one static inline rule with a local class.                                                     |
| `src/ui/organisms/Navbar/Navbar.svelte`                    | Medium | Keep navigation styles scoped; source navbar colours/spacing from tokens.                                  |
| `src/ui/organisms/Navbar/NavbarLinks/NavbarLinks.svelte`   | Medium | Tokenise links and active/hover states in its existing style block.                                        |
| `src/lib/components/ExpandableButton.svelte`               | Low    | Move fixed height to a local class or the Button variant API.                                              |
| `src/lib/components/Breadcrumbs.svelte`                    | Low    | Keep its simple local block; tokenise gap/spacing if repeated.                                             |
| `src/lib/components/Tracking.svelte`                       | Low    | No styling migration indicated.                                                                            |
| `src/lib/components/SocialPreview.svelte`                  | Low    | No styling migration indicated.                                                                            |
| `src/lib/components/Users/Avatar.svelte`                   | Low    | Keep scoped avatar styling and replace raw values with tokens if applicable.                               |
| `src/lib/components/Users/ChangeUsername.svelte`           | Medium | Move one inline declaration into its local block; rely on migrated form atoms.                             |
| `src/lib/components/Users/DeleteUser.svelte`               | Low    | Primarily utility/global-class usage; migrate after Button/Card APIs settle.                               |
| `src/lib/components/Users/ReportUser.svelte`               | Low    | Primarily utility/global-class usage; migrate after form/layout primitives settle.                         |
| `src/lib/components/ErrorPages/GenericErrorPage.svelte`    | Low    | Keep local styles; tokenise only shared values.                                                            |
| `src/lib/components/ErrorPages/Generic/FourOhFour.svelte`  | Low    | Move two static inline declarations into local CSS.                                                        |
| `src/lib/components/ErrorPages/Generic/FiveHundred.svelte` | Low    | Move three static inline declarations into local CSS.                                                      |
| `src/lib/components/ErrorPages/Feedback.svelte`            | Low    | Keep existing scoped styling and tokenise shared values.                                                   |
| `src/lib/components/ErrorPages/FeedbackDiscord.svelte`     | Low    | Keep existing scoped styling and tokenise shared values.                                                   |
| `src/lib/components/ErrorPages/Pokemon404.svelte`          | Low    | Move the one static inline declaration to local CSS.                                                       |

### Features

| File                                                  | Effort | Plan                                                                                   |
| ----------------------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `src/features/notifications/Notification.svelte`      | Low    | Keep scoped styles; source notification colours and spacing from tokens.               |
| `src/features/search/SearchBar.svelte`                | Medium | Move fixed width inline styling into its local block and use tokenised control styles. |
| `src/features/pokedex/pokemon/VarietySelector.svelte` | Low    | Move the static inline select layout into local CSS.                                   |
| `src/features/pokedex/pokemon/Navigator.svelte`       | Medium | Mostly utility/global layout classes; migrate after layout primitives are chosen.      |
| `src/features/tags/AttachedTags.svelte`               | Low    | Move static icon alignment to local CSS and tokenise tag colours.                      |
| `src/features/tags/new/CreateNewTag.svelte`           | Medium | Preserve existing scoped component styles; migrate form/control dependencies.          |

### Shared routes and authentication

| File                                                  | Effort | Plan                                                                                                                         |
| ----------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/+layout.svelte`                           | Medium | Move layout/breadcrumb inline rules to local classes; retain font loading globally, not in `<svelte:head>`.                  |
| `src/routes/+page.svelte`                             | Low    | Move two static inline layout rules into its existing scoped style block.                                                    |
| `src/routes/+error.svelte`                            | Low    | Keep existing local error style; tokenise values if any.                                                                     |
| `src/routes/Footer.svelte`                            | Medium | Move four inline declarations to its existing local block; replace shared column helpers once a layout approach is selected. |
| `src/routes/Greeting.svelte`                          | Low    | Move two static inline alignment rules to a local block.                                                                     |
| `src/routes/ScrollToTop.svelte`                       | Low    | Keep local style block; tokenise colour/elevation values.                                                                    |
| `src/routes/SelfMarketing.svelte`                     | Low    | Utility/global layout only; migrate after layout decision.                                                                   |
| `src/routes/about/+page.svelte`                       | Low    | Keep local page styles and tokenise raw values.                                                                              |
| `src/routes/app/invite/+page.svelte`                  | Low    | Keep local form/page styles and use form tokens.                                                                             |
| `src/routes/feedback/+page.svelte`                    | Low    | Utility/global layout only; migrate after layout decision.                                                                   |
| `src/routes/settings/+page.svelte`                    | Medium | Move inline declarations and consolidate its local style block with tokenised controls.                                      |
| `src/routes/auth/signin/+page.svelte`                 | Medium | Move two static inline layout declarations locally; coordinate shared `brands.css`.                                          |
| `src/routes/auth/signin/Email.svelte`                 | Medium | Replace five inline margins with local classes; retain responsive rules in the scoped block.                                 |
| `src/routes/auth/signin/Github.svelte`                | Medium | Keep provider-specific styles local/imported and move values to brand tokens.                                                |
| `src/routes/auth/signin/Google.svelte`                | Medium | Move icon inline dimensions to local CSS; tokenise shared sign-in sizing.                                                    |
| `src/routes/auth/signin/Spotify.svelte`               | Medium | Move icon inline declarations to local CSS; preserve provider brand colour as a named exception token.                       |
| `src/routes/auth/reset-password/+page.svelte`         | Low    | Keep local page rules; consume migrated Card/Button/Form primitives.                                                         |
| `src/routes/auth/reset-password/[token]/+page.svelte` | Low    | Move two static inline layout declarations to a local block.                                                                 |

### Pokédex, Pokémon, move, and item routes

| File                                                                              | Effort | Plan                                                                                                   |
| --------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `src/routes/pokedex/+page.svelte`                                                 | Medium | Existing scoped page layout is a good target; tokenise repeated gaps, surfaces, borders, and radii.    |
| `src/routes/pokedex/[pokedexid=integer]/+page.svelte`                             | Low    | Utility/global layout only; migrate once layout/card primitives are ready.                             |
| `src/routes/pokedex/[pokedexid=integer]/pokemon/[pokemonid=integer]/+page.svelte` | Low    | Utility/global layout only; migrate after primitives.                                                  |
| `src/routes/pokemon/+page.svelte`                                                 | Low    | Utility/global layout only; migrate after list/card primitives.                                        |
| `src/routes/pokemon/PageNavigator.svelte`                                         | Low    | Utility/global layout only; migrate after Button/layout primitives.                                    |
| `src/routes/pokemon/[pokedexid=integer]/+page.svelte`                             | Low    | Utility/global layout only; migrate after component children.                                          |
| `src/routes/pokemon/[pokedexid=integer]/Abilities.svelte`                         | Medium | Move repeated static icon alignment/height declarations to local classes.                              |
| `src/routes/pokemon/[pokedexid=integer]/BaseStats.svelte`                         | Medium | Retain scoped chart/layout rules; tokenise dimensions/colours cautiously.                              |
| `src/routes/pokemon/[pokedexid=integer]/EncounterVersion.svelte`                  | Low    | Keep scoped styles and use tokens for repeated dimensions.                                             |
| `src/routes/pokemon/[pokedexid=integer]/Encounters.svelte`                        | Medium | Replace repeated fixed-height inline rules with a local reusable class.                                |
| `src/routes/pokemon/[pokedexid=integer]/EvolutionChain.svelte`                    | Medium | Replace repeated static inline rules with local classes; preserve data-driven layout.                  |
| `src/routes/pokemon/[pokedexid=integer]/Move.svelte`                              | Low    | Move static image sizing into its existing local style block.                                          |
| `src/routes/pokemon/[pokedexid=integer]/Moveset.svelte`                           | Medium | Move repeated inline button/image rules locally; keep responsive grid scoped.                          |
| `src/routes/pokemon/[pokedexid=integer]/NavigationButton.svelte`                  | Low    | Move two static inline declarations to a local class or Button variant.                                |
| `src/routes/pokemon/[pokedexid=integer]/Navigator.svelte`                         | Low    | Utility/global layout only; migrate after navigation/Button primitives.                                |
| `src/routes/pokemon/[pokedexid=integer]/Pokedex.svelte`                           | Low    | Move its one static inline rule into existing scoped CSS.                                              |
| `src/routes/pokemon/[pokedexid=integer]/PokemonCard.svelte`                       | High   | Separate dynamic colour/triangle geometry from static card CSS; tokenise only non-data-derived values. |
| `src/routes/pokemon/[pokedexid=integer]/SpritePreview.svelte`                     | Medium | Move fixed image/modal sizing into local classes; retain dynamic display state.                        |
| `src/routes/pokemon/[pokedexid=integer]/TypeMatchup.svelte`                       | Low    | Move static image sizing to its existing local style block.                                            |
| `src/routes/move/[moveid=integer]/+page.svelte`                                   | Medium | Replace three static inline rules and tokenise its existing scoped layout.                             |
| `src/routes/item/[itemId]/+page.svelte`                                           | Low    | Move fixed sprite dimensions into its existing scoped block.                                           |

### User tags, search, and privacy routes

| File                                                            | Effort | Plan                                                                                             |
| --------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| `src/routes/search/+page.svelte`                                | Medium | Move two static inline styles into the existing route block; tokenise its larger local rule set. |
| `src/routes/user/[username]/+page.svelte`                       | Low    | Move two static inline declarations into a new local block.                                      |
| `src/routes/user/[username]/AccountOwnerOptions.svelte`         | Low    | Move three static inline declarations into a local block.                                        |
| `src/routes/user/[username]/EmailVerification.svelte`           | Low    | No styling migration indicated.                                                                  |
| `src/routes/user/[username]/tags/[tagId]/+page.svelte`          | Low    | Utility/global layout only; migrate after tag/card primitives.                                   |
| `src/routes/user/[username]/tags/[tagId]/Header.svelte`         | Low    | Move one static inline declaration to local CSS.                                                 |
| `src/routes/user/[username]/tags/[tagId]/MoveCardEntry.svelte`  | Medium | Replace three inline rules with local classes and tokenise existing dimensions.                  |
| `src/routes/user/[username]/tags/[tagId]/TagEditor.svelte`      | Medium | Move its inline toolbar layout into existing scoped CSS; consume form tokens.                    |
| `src/routes/user/[username]/tags/[tagId]/TagMove.svelte`        | Medium | Keep its scoped remove-control styles; tokenise shared sizing/colours.                           |
| `src/routes/user/[username]/tags/[tagId]/TagPokemon.svelte`     | Medium | Move inline style and tokenise existing scoped remove-control styles.                            |
| `src/routes/user/[username]/tags/[tagId]/TagViewOptions.svelte` | Low    | Move two static inline icon alignment rules to a local class.                                    |
| `src/routes/privacy/+page.svelte`                               | Low    | Utility/global layout only; migrate only if heading/layout helpers are removed.                  |
| `src/routes/privacy/policy/versions/+page.svelte`               | Low    | Utility/global layout only; migrate only if heading/layout helpers are removed.                  |
| `src/routes/privacy/policy/versions/2024-07-14/+page.svelte`    | Low    | Keep route-local historical policy styles; avoid content/layout drift.                           |
| `src/routes/privacy/policy/versions/2025-12-14/+page.svelte`    | Low    | Keep route-local historical policy styles; avoid content/layout drift.                           |
| `src/routes/privacy/policy/versions/2026-03-21/+page.svelte`    | Low    | Keep route-local historical policy styles; avoid content/layout drift.                           |

## Completion criteria

- One active global stylesheet entry point and one **design tokens** file.
- No duplicate token definitions or duplicate Tailwind imports.
- Static component-owned inline styles are represented by local classes and
  scoped `<style>` blocks.
- Dynamic values use CSS custom properties or deliberate `style:` directives.
- Global class APIs either have an explicit owner or are fully retired.
- Light/dark and responsive visual regression checks pass for all high- and
  medium-effort files.
