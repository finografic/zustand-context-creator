# GitHub Copilot Instructions

> **Note**: These instructions are shared with Cursor AI. The source of truth is `.cursor/rules/` - all edits should be made there. The files in `.github/instructions/` are symlinks to the Cursor rules.

## Overview

This package follows TypeScript best practices for creating reusable, well-typed utilities. All rules are defined in `.cursor/rules/` and shared with both Cursor and GitHub Copilot.

## Core Principles

See `.cursorrules` for the main package guidelines.

## Detailed Rules

The following instruction files contain detailed coding standards and patterns:

- [General Development Rules](.github/instructions/00-general.instructions.md) - General coding principles
- [File Naming](.github/instructions/01-file-naming.instructions.md) - File/folder naming conventions
- [TypeScript Patterns](.github/instructions/02-typescript-patterns.instructions.md) - TypeScript best practices
- [Provider/Context Patterns](.github/instructions/03-provider-context-patterns.instructions.md) - Zustand/Context patterns (core to this package)
- [ESLint & Code Style](.github/instructions/04-eslint-code-style.instructions.md) - ESLint configuration rules
- [Documentation](.github/instructions/05-documentation.instructions.md) - Documentation standards
- [Modern TypeScript](.github/instructions/06-modern-typescript-patterns.instructions.md) - Advanced TypeScript patterns

## Quick Reference

When working on this package:
- ✅ Use TypeScript with strict mode
- ✅ Follow patterns in `03-provider-context-patterns.md` for store creation
- ✅ Use named parameters for functions with 2+ arguments
- ✅ Keep files in `src/`, build output in `dist/`
- ✅ Focus on reusable, well-typed utilities

