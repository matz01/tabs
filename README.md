# Frontend Interview - Design System

Hey 👋

This is the base repository for the home test. The repository is created with `vite` and is empty, but contains some packages already installed, in particular:

- `react`
- `storybook`
- `vitest`

## Install and run

```bash
# Install dependencies
# This project use `pnpm` as package manager, but you can use also `npm` or `yarn`.
pnpm install

# And run the project
pnpm dev

# Optional: Run Storybook
pnpm storybook
```

## Figma file

The figma file of the home test is available [here](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/%F0%9F%92%BB-Design-System-Home-Test---Tabs-Component?node-id=0-1&t=4pG7NN6HKxgxroDz-1).

## Design decisions

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
