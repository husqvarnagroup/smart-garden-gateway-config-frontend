# scripts/translations

Scripts for managing the i18n locale files in `src/i18n/locales/`.

## sort-translations.js

Sorts the keys in every `*.yaml` locale file alphabetically (in-place). Dotted keys like `actions.add`, `error.load`, `success.save` still cluster by namespace as a side effect of the sort.

The script is line-based — it parses each line as `key: value`, sorts by key, and re-emits without touching the value text. This preserves the exact quoting, escapes, and trailing characters of each translated string.

### Usage

```sh
node scripts/translations/sort-translations.js
```
