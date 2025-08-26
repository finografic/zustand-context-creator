# TODO: REVIEW - `@eslint-react/eslint-plugin`

<https://github.com/Rel1cx/eslint-react/tree/main>

A series of composable ESLint Plugins for libraries and frameworks that use React as a UI runtime.

## Features

- **Modern**: First-class support for TypeScript, React 19, and more.
- **Flexible**: Increased flexibility with more granular severity control.
- **Performant**: Built with performance in mind, optimized for large codebases.
- **Comprehensive**: Handles complex scenarios and identifies problems that other tools might miss.

## Public Packages

### Modular

- [`eslint-plugin-react-x`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) - Core rules (renderer-agnostic, compatible with x-platform).
- [`eslint-plugin-react-dom`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) - DOM specific rules for React DOM.
- [`eslint-plugin-react-web-api`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-web-api) - Rules for interacting with Web APIs.
- [`eslint-plugin-react-hooks-extra`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-hooks-extra) - Extra React Hooks rules.
- [`eslint-plugin-react-naming-convention`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-naming-convention) - Naming convention rules.

### All-In-One

- [`@eslint-react/eslint-plugin`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin) - Main plugin combining all rules and presets from the above packages.

## installation

```sh
npm install --save-dev typescript-eslint @eslint-react/eslint-plugin
```

## example usage

```ts
// eslint.config.js

import eslintReact from '@eslint-react/eslint-plugin';
// @ts-check
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    eslintJs.configs.recommended,
    tseslint.configs.recommended,
    eslintReact.configs['recommended-typescript'],
  ],
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    // Put rules you want to override here
    '@eslint-react/no-class-component': 'error',
  },
});
```

[Full Installation Guide ↗](https://eslint-react.xyz/docs/getting-started/typescript)

### Bare Bones

- **Core** (`core`)\
  Enable rules for `"react"`.
- **DOM** (`dom`)\
  Enable rules for `"react-dom"`.
- **Web API** (`web-api`)\
  Enable rules for interacting with Web APIs.

### General Purpose

- **Recommended** (`recommended`)\
  Enforce rules that are recommended by ESLint React for general purpose React + React DOM projects.\
  _This preset includes the `core`, `dom`, and `web-api` presets._

### TypeScript Specialized

- **Recommended TypeScript** (`recommended-typescript`)\
  Same as the `recommended` preset but disables rules that can be enforced by TypeScript.

- **Recommended Type-Checked** (`recommended-type-checked`)\
  Same as the `recommended-typescript` preset but enables additional rules that require type information.

---

## `package.json`

```json
{
  "name": "@eslint-react/monorepo",
  "version": "1.39.0-next.3",
  "private": true,
  "description": "Monorepo for eslint-plugin-react-[x, dom, web-api, hooks-extra, naming-convention].",
  "keywords": [
    "react",
    "eslint",
    "eslint-react",
    "eslint-plugin",
    "eslint-plugin-react-x",
    "eslint-plugin-react-dom",
    "eslint-plugin-react-web-api",
    "eslint-plugin-react-hooks-extra",
    "eslint-plugin-react-naming-convention"
  ],
  "homepage": "https://github.com/Rel1cx/eslint-react",
  "bugs": {
    "url": "https://github.com/Rel1cx/eslint-react/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Rel1cx/eslint-react.git"
  },
  "license": "MIT",
  "author": "Eva1ent<rel1cx@proton.me>",
  "type": "module",
  "scripts": {
    "build": "pnpm run update:all && nx run-many -t build --projects=\"packages/**\"",
    "build:all": "nx run-many -t build",
    "build:docs": "nx run-many -t build:docs --projects=\"packages/**\" && pnpm run update:readme",
    "build:pkgs": "pnpm -F \"./.pkgs/*\" run build",
    "build:website": "pnpm run update:website && pnpm -F \"./apps/website\" run build",
    "format:check": "dprint check",
    "format:package-json": "pnpm m exec sort-package-json -q package.json && dprint fmt",
    "format:write": "dprint fmt",
    "inspect:deps": "skott -e .ts",
    "inspect:eslint-config": "eslint-config-inspector",
    "lint": "pnpm run lint:deps && pnpm run lint:publish && pnpm run lint:ts && pnpm run lint:es && pnpm run lint:examples",
    "lint:deps": "skott -m file-tree -e .ts -s",
    "lint:es": "eslint . --max-warnings 10",
    "lint:examples": "pnpm m -F \"./examples/*\" run lint",
    "lint:publish": "pnpm m run lint:publish",
    "lint:spell": "cspell lint --relative --no-progress \"**\"",
    "lint:ts": "pnpm m run lint:ts",
    "lint:website": "pnpm -F \"./apps/website\" run lint",
    "prepare": "lefthook install && pnpm run build",
    "test": "vitest run --logHeapUsage",
    "update:all": "pnpm run update:version && pnpm run update:readme && pnpm run update:website",
    "update:readme": "tsx ./scripts/update-readme.ts",
    "update:version": "tsx ./scripts/update-version.ts",
    "update:website": "tsx ./scripts/update-website.ts"
  },
  "devDependencies": {
    "@eslint/config-inspector": "^1.0.2",
    "@eslint/markdown": "^6.3.0",
    "@local/configs": "workspace:*",
    "@local/eslint-plugin-local": "workspace:*",
    "@swc/core": "^1.11.13",
    "@tsconfig/node22": "^22.0.1",
    "@tsconfig/strictest": "^2.0.5",
    "@types/node": "^22.13.14",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4",
    "@typescript-eslint/parser": "^8.28.0",
    "@typescript-eslint/rule-tester": "^8.28.0",
    "@typescript-eslint/types": "^8.28.0",
    "ansis": "^3.17.0",
    "cspell": "^8.18.1",
    "dedent": "^1.5.3",
    "dprint": "^0.49.1",
    "esbuild": "^0.25.2",
    "eslint": "^9.23.0",
    "eslint-config-flat-gitignore": "^2.1.0",
    "eslint-plugin-vitest": "^0.5.4",
    "jiti": "^2.4.2",
    "lefthook": "^1.11.5",
    "markdownlint": "^0.37.4",
    "nx": "20.6.4",
    "publint": "^0.3.9",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "skott": "^0.35.4",
    "tinyexec": "^1.0.1",
    "tinyglobby": "^0.2.12",
    "ts-pattern": "^5.7.0",
    "tsup": "^8.4.0",
    "tsx": "^4.19.3",
    "type-fest": "^4.38.0",
    "typedoc": "^0.28.1",
    "typedoc-plugin-markdown": "^4.6.0",
    "typedoc-plugin-mdn-links": "^5.0.1",
    "typedoc-plugin-missing-exports": "^4.0.0",
    "typescript": "^5.8.2",
    "typescript-eslint": "^8.28.0",
    "vitest": "^3.0.9"
  },
  "packageManager": "pnpm@10.7.0",
  "engines": {
    "node": ">=18.18.0"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "@swc/core",
      "dprint",
      "esbuild",
      "lefthook",
      "nx",
      "sharp"
    ],
    "overrides": {
      "@types/react": "^19.0.12",
      "@types/react-dom": "^19.0.4",
      "cross-spawn": "^7.0.6",
      "esbuild": "^0.25.2",
      "is-core-module": "npm:@socketregistry/is-core-module@^1.0.8",
      "lucide-react": "^0.485.0",
      "next": "^15.2.4",
      "react": "^19.1.0",
      "react-dom": "^19.1.0",
      "safe-buffer": "npm:@socketregistry/safe-buffer@^1.0.7",
      "safer-buffer": "npm:@socketregistry/safer-buffer@^1.0.8",
      "ts-api-utils": "^2.1.0",
      "typedarray": "npm:@socketregistry/typedarray@^1.0.6",
      "typescript": "^5.8.2"
    }
  }
}
```
