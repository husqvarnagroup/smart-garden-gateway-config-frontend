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
- Complex logic → extract to `useComponentName.ts` in same directory (see `DropdownSelect/useDropdownSelect.ts`)
- Translations: `const { t } = useTranslation()` from `i18next-vue`
- Async state: `useAsync` from `@/composables/useAsync` — required when loading state or fetched data is exposed in the template; plain `async` functions are fine for fire-and-forget operations that only update local refs
- Auth state: `useAuth` from `@/composables/useAuth`

---

## CSS Custom Properties

All design tokens live in `src/styles/global.css` as CSS custom properties on `:root`. Use them always — no raw hex, rgba, px, or rem values in component styles.

```css
/* wrong */
padding: 16px;
color: #666;

/* right */
padding: var(--space-4);
color: var(--color-grey-400);
```

Available token groups: `--space-*`, `--text-*`, `--radius-*`, `--layout-*`, `--color-*`.

Color subgroups: `grey`, `orange`, `blue`, `green`, `red`, `shadow`, `overlay`.

---

## Class Naming in Scoped CSS

All component styles use `<style scoped>`. Scoped CSS provides isolation — no prefixing needed.

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
- State: shared reactive state in `src/state/`; wrap access in composables, never import state directly in components
