# Tabs — Design System home test

Accessible, reusable `Tabs` component with `Badge` support, built with raw React,
TypeScript and hand-written SCSS modules. No component or CSS libraries.

## Install and run

Requires Node 24+ and pnpm (via Corepack).

```bash
pnpm install
pnpm dev              # demo page
pnpm storybook        # component docs and playground
pnpm test             # unit and interaction tests (Vitest + Testing Library)
pnpm tsc              # type check
pnpm check            # Biome lint and format
```

## Figma file

The figma file of the home test is available [here](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=0-1&t=4pG7NN6HKxgxroDz-1).

## Usage

```tsx
import { Tab, TabList, TabPanel, Tabs } from "./src";

<Tabs defaultValue="emails" variant="underline">
  <TabList aria-label="Inbox sections">
    <Tab value="emails">Emails</Tab>
    <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
      Files
    </Tab>
  </TabList>
  <TabPanel value="emails">…</TabPanel>
  <TabPanel value="files">…</TabPanel>
</Tabs>;
```

### API

| Component  | Prop            | Type                                         | Default     |
| ---------- | --------------- | -------------------------------------------- | ----------- |
| `Tabs`     | `defaultValue`  | `string` (uncontrolled)                      | –           |
|            | `value`         | `string` (controlled)                        | –           |
|            | `onValueChange` | `(value: string) => void`                    | –           |
|            | `variant`       | `"pill" \| "underline"`                      | `"pill"`    |
| `TabList`  | `aria-label`    | `string` — names the tab list                | –           |
| `Tab`      | `value`         | `string` — must match a `TabPanel`           | –           |
|            | `badge`         | `{ label: string; variant?: BadgeVariant }`  | –           |
| `TabPanel` | `value`         | `string`                                     | –           |
| `Badge`    | `label`         | `string`                                     | –           |
|            | `variant`       | `"neutral" \| "positive" \| "negative"`      | `"neutral"` |

`value` and `defaultValue` are mutually exclusive at type level. Every component
also accepts the native attributes of the element it renders.

## Design decisions

### Compound components with Context

`Tabs` owns the state and shares it through React Context with `TabList`, `Tab`
and `TabPanel`. Consumers compose the markup freely (wrappers, conditional tabs,
panels elsewhere in the layout) without prop drilling or `cloneElement`. It is
the same shape used by Radix UI, Reach UI and React Aria, so it is familiar to
consumers. Using a part outside `<Tabs>` throws a descriptive error.

### Controlled and uncontrolled

`defaultValue` covers the common case; `value` + `onValueChange` lets the parent
own the selection (routing, persistence, analytics). `onValueChange` fires only
when the value actually changes.

### Badge through the Tab API

The badge is a data prop (`badge={{ label, variant }}`) rather than a child, as
required by the user stories. The Tab controls placement, spacing and the
accessible name ("Files Warning"), so badges stay consistent across the system.
`Badge` is also exported as a standalone component.

### Accessibility (WAI-ARIA APG Tabs pattern)

- `tablist` / `tab` / `tabpanel` roles, `aria-selected`, `aria-controls`,
  `aria-labelledby`; ids derived from `useId`, unique per instance.
- Roving tabindex: only the selected tab is in the Tab sequence; arrows move
  between tabs (with wrap), `Home` / `End` jump to the ends.
- **Automatic activation**: focusing a tab selects it. Panels are local and
  cheap, so this is the APG recommendation; manual activation would be the
  choice if panels loaded data.
- Panels stay mounted and use `hidden`: `aria-controls` always points to an
  existing element and inactive panels keep their state. Panels are focusable
  (`tabIndex=0`) so keyboard users can reach text-only content; pass
  `tabIndex={-1}` when the panel already contains focusable elements.
- Tabs are `<button type="button">` so they never submit a surrounding form.
- Visible `:focus-visible` ring matching the Figma Focus state.
- Consumer `onClick` / `onKeyDown` run first and can opt out with
  `preventDefault()`.

### Responsive behaviour

A single breakpoint (`max-width: 768px`, the Figma "Mobile" flag) via a Sass
mixin changes heights, paddings and gaps. On narrow screens the tab list scrolls
horizontally instead of wrapping, as in the handoff mockups.

### Styling hooks

Variants and state are exposed as attributes (`data-variant`, `aria-selected`)
and styled from them. The same attribute drives accessibility and visuals, and
tests can assert on them since jsdom does not compute CSS.

### Public API

`src/index.ts` is the single entry point of the package. There are no
per-component barrel files, so "find usages" lands on the component itself.

### Components forward native attributes

Every component accepts the props of the HTML element it renders
(`Badge` → `<span>`) and forwards them, so consumers can add
`data-testid`, `aria-*`, `className` or event handlers without the
component having to anticipate them.

- **System props win.** Consumer props are spread first, so
  `variant` and the base class cannot be overridden by accident.
  `className` is merged, not replaced.
- **No test-only API.** Test ids are chosen by the test, as with any
  HTML element, instead of being a required component prop.
- **Trade-off.** This widens the API: a consumer could pass `style`
  and drift from the design. I accepted it as an escape hatch; a
  stricter system could whitelist `className`, `data-*` and `aria-*`.

## Styling components

Design tokens (colors, typography, spacing) live in `src/styles/tokens/`
and are exposed to components through Sass functions.

```scss
@use "./src/styles/tokens" as *;

.badge {
  padding: space("3xs") space("2xs");
  font-family: font-family("base"), sans-serif;
  font-size: font-size("body-s");
  font-weight: font-weight("semibold");
  color: color("text-primary");
  background-color: color("feedback-neutral-bg");
}
```

| Function          | Tokens                                   | Source              |
| ----------------- | ---------------------------------------- | ------------------- |
| `color($role)`    | semantic roles, e.g. `"text-primary"`     | `_colors.scss`      |
| `space($name)`    | `"0"`, `"4xs"` … `"2xl"`                 | `_spacing.scss`     |
| `font-family($name)`, `font-size($name)`, `font-weight($name)`, `line-height($name)` | e.g. `"base"`, `"body-s"`, `"semibold"`, `"body"` | `_typography.scss` |

Rules:

- **Use the functions, never `var(--…)` directly.** An unknown token name
  fails the build with the list of valid names; a raw `var()` with a typo
  fails silently in the browser.
- **Colors are roles, not raw values.** `color()` only accepts semantic
  roles; the palette is private to `_colors.scss`.
- **Load the tokens once.** Functions compile to CSS custom properties
  defined in `src/styles/global.scss`, which must be imported once at the
  app root (already done in `.storybook/preview.ts`).

### Adding a token

Add the entry to the map in the relevant `tokens/_*.scss` file. The custom
property is generated by `global.scss` and the function accepts the new
name automatically; nothing else needs to change.

## Testing

Tests describe behaviour from the user's point of view with Testing Library
queries by role and `user-event`:

- ARIA structure, id linking and unique ids across instances
- roving tabindex and focus moving from tab list to panel
- mouse and keyboard navigation (arrows, wrap, `Home` / `End`, ignored keys)
- controlled vs uncontrolled behaviour and `onValueChange`
- variants, badge variants and accessible names
- native attribute forwarding, `className` merging, composition errors
