# File Naming & Organization Rules

## File Naming Conventions

- Use kebab-case for file names: `zustand-core.ts`
- Use camelCase for utility files: `apiUtils.ts`
- Use descriptive names that indicate file purpose
- Use PascalCase for exported types/interfaces when appropriate

## File Extensions

- `.ts` for TypeScript utilities and types
- `.types.ts` for type-only files
- `.constants.ts` for constant definitions
- `.utils.ts` for utility functions
- `.example.ts` for example files

## Directory Structure

```
src/
  utils/
    zustand-core.ts           # Core functionality
    zustand-extensions.ts     # Extended features
    examples/                  # Example implementations
      complete-store-example/
        TodoContext.ts
        TodoProvider.tsx
        TodoTypes.ts
```

## Import/Export Patterns

- Use named exports over default exports
- Create index.ts files to simplify imports
- Group related exports in index files
- Use barrel exports for cleaner import paths

## Generated Files

- Mark generated files with `🤖 AUTO-GENERATED` comment
- Include generation timestamp
- Add "DO NOT EDIT MANUALLY" warning
- Use `.generated.ts` suffix for generated files

## Configuration Files

- Package configs in package root
- Use descriptive names: `tsup.config.ts`, `eslint.config.ts`
- Separate config from implementation
