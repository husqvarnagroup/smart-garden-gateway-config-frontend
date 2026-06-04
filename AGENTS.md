<!--
SPDX-FileCopyrightText: 2026 GARDENA GmbH

SPDX-License-Identifier: GPL-3.0-or-later
-->

# AGENTS.md

Rules for AI agents working in this repo. Follow exactly — no exceptions for "just this one case."

---

## Vue Component Structure

All components use `<script setup lang="ts">`. No Options API. No `defineComponent`.

```vue
<script setup lang="ts">
// imports first, then props/emits, then composables, then local logic
const props = defineProps<{ label: string; disabled?: boolean }>();
const emit = defineEmits<{ change: [value: string] }>();
</script>
```

- Props/emits always typed with generics — no runtime declarations (`{ type: String }`)
- `defineModel` is fine for simple field-style components
- Extract logic to `useComponentName.ts` in the same directory when it is reused, hard to scan inline, or easier to test in isolation (see `DropdownSelect/useDropdownSelect.ts`)
- Translations: `const { t } = useTranslation()` from `i18next-vue`
- Async state: `useAsync` from `@/composables/useAsync` — required when loading state or fetched data is exposed in the template; plain `async` functions are fine for fire-and-forget operations that only update local refs
- Editable fetched config flows: prefer `useOptimisticSubmit` when the UI needs optimistic local state with rollback on save failure
- User-visible async feedback: use `useToast` for success/error messages triggered by user actions
- Auth state in components: use `useAuth` from `@/composables/useAuth`

---

## CSS Custom Properties

All design tokens live in `src/styles/global.css` as CSS custom properties on `:root`. In component styles, prefer existing tokens over raw values. Do not introduce new raw hex, rgba, px, or rem values when an existing token expresses the same value.

```css
/* wrong */
padding: 16px;
color: #666;

/* right */
padding: var(--space-4);
color: var(--color-grey-400);
```

`src/styles/global.css` is the place where raw token primitives are defined, so raw values there are expected.

When touching existing component styles that still use legacy raw values, prefer migrating them to tokens as part of the same change when it stays small and clear.

Available token groups: `--space-*`, `--text-*`, `--radius-*`, `--layout-*`, `--color-*`.

Color subgroups: `grey`, `orange`, `blue`, `green`, `red`, `shadow`, `overlay`.

---

## Class Naming In Scoped CSS

Use `<style scoped>` in component files. Scoped CSS provides isolation, so no component-name prefixing is needed.

### 1. Use element selectors for unique elements

If a component has exactly one instance of a given element, style it directly.

```css
/* wrong */
.btn {
}
.field-label {
}

/* right */
button {
}
label {
}
```

### 2. Prefer ARIA role selectors for semantic elements

When an element has a meaningful ARIA role, select by role instead of adding a class.

```css
/* wrong */
.list {
}
.listbox {
}

/* right */
[role='listbox'] {
}
[role='option'] {
}
```

Use class selectors when no ARIA role applies or when multiple same-role elements need differentiation.

### 3. No component-name prefix

```css
/* wrong */
.wifi-option {
}
.base-select__trigger {
}

/* right */
.option {
}
button {
}
```

### 4. No element type in class name

The HTML tag already communicates the element type.

```css
/* wrong */
.chevron-btn {
}
.confirm-div {
}

/* right */
.chevron {
}
.actions {
}
```

### 5. Short semantic names

Name what the element IS, not where it comes from.

```css
/* wrong */
.base-select__list {
}
.base-select__status--error {
}

/* right */
[role='listbox'] {
}
.status.error {
}
```

### 6. State as plain classes

```html
<!-- wrong -->
:class="{ 'chevron-btn--open': isOpen }"

<!-- right -->
:class="{ open: isOpen }"
```

```css
/* wrong */
.chevron-btn--open {
}

/* right */
.chevron.open {
}
```

---

## File & Import Conventions

- `@/` alias maps to `src/`
- Components: `PascalCase.vue`
- Composables: `useCamelCase.ts`
- i18n keys: `src/i18n/locales/en.yaml` is source of truth; other locales mirror structure
- State: shared reactive state lives in `src/state/`
- Components should not import state directly; wrap component access in composables
- Outside components, direct state imports are acceptable for shared infrastructure such as API/session plumbing, but prefer composables as the public interface when that keeps the call site clearer
