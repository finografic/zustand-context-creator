# General Development Rules

## Code Quality & Standards

- Always use TypeScript with strict mode enabled
- Prefer type-safe code over any types
- Use consistent naming conventions (camelCase for variables, PascalCase for components/types)
- Add JSDoc comments for complex functions and public APIs
- Prefer explicit return types for functions
- Use meaningful variable and function names that describe their purpose
- For both JSDoc and simple comments, include name and version of model used to generate, between square-brackets [Model vX.X]
- Follow TypeScript parameter patterns from `02-typescript-patterns.md`
- Follow provider/context patterns from `03-provider-context-patterns.md`
- Follow documentation patterns from `05-documentation.md`

## Error Handling

- Always handle errors explicitly, never ignore them
- Use proper error types and avoid generic Error objects when possible
- Provide clear error messages for library users
- Log errors with sufficient context for debugging

## Control Flow & Conditionals

### Guard Clauses (Preferred)

- **ALWAYS prefer guard clauses** for early returns over nested if/else
- Guard clauses improve readability by handling edge cases first
- Reduce cognitive load by flattening nested logic

```typescript
// ✅ GOOD: Guard clauses (flat, readable)
function processUser(user: User): string {
  if (!user) return 'No user';
  if (!user.isActive) return 'Inactive user';
  if (!user.permissions) return 'No permissions';

  return `Welcome ${user.name}`;
}

// ❌ BAD: Nested if/else (hard to follow)
function processUser(user: User): string {
  if (user) {
    if (user.isActive) {
      if (user.permissions) {
        return `Welcome ${user.name}`;
      } else {
        return 'No permissions';
      }
    } else {
      return 'Inactive user';
    }
  } else {
    return 'No user';
  }
}
```

### Ternaries (Use Sparingly)

- **Single-level ternaries** are acceptable when simpler and more elegant
- **NEVER use nested ternaries** - use guard clauses or helper functions instead
- Ternaries are best for simple value assignments or JSX conditionals

```typescript
// ✅ GOOD: Simple ternary (clear intent)
const label = isActive ? 'Active' : 'Inactive';
const icon = <Icon name={isValid ? 'check' : 'error'} />;

// ⚠️ ACCEPTABLE: Simple JSX conditional
return isLoading ? <Spinner /> : <Content />;

// ❌ BAD: Nested ternary (confusing)
const status = isActive ? 'active' : isPending ? 'pending' : isError ? 'error' : 'unknown';

// ✅ GOOD: Guard clauses instead
function getStatus(): string {
  if (isActive) return 'active';
  if (isPending) return 'pending';
  if (isError) return 'error';
  return 'unknown';
}
```


### Key Principles

1. **Early returns** - Handle edge cases first, then normal flow
2. **Flat over nested** - Avoid else/else-if chains when possible
3. **Simple ternaries only** - Complex logic deserves proper functions
4. **Self-documenting** - Code should read like prose

## Performance

- Optimize bundle size by avoiding unnecessary imports
- Use tree-shaking friendly exports
- Minimize dependencies to keep package lightweight
- Use dynamic imports for optional features when appropriate

## Security

- Never expose sensitive data in library code
- Validate inputs in public APIs
- Use environment variables for configuration when needed

## Markdown Formatting

### Headings

- Use headings (`##`, `###`, etc.) WITHOUT additional bold formatting (`**`)
- Headings are already bold by default
- Wrap code elements in headings with backticks for proper styling
- Examples:
  - `## Section Title` not `## **Section Title**`
  - `## 1. tsup.config.ts ✅` not `## 1. **tsup.config.ts** ✅`
  - `### For vite.config.ts` not `### For **vite.config.ts**`

### Code Formatting

- Always add line breaks above and below code blocks for clear separation
- Wrap filenames, paths, method names, variables in backticks for inline code formatting
- Examples:
  - Filenames: `vite.config.ts`, `package.json`
  - Paths: `src/components/Button.tsx`, `@workspace/i18n/generators`
  - Methods: `generateTypes()`, `useState()`
  - Variables: `workspaceRoot`, `baseColor`

### Code Block Spacing

```typescript
// ✅ Correct - line breaks above and below
const example = 'proper spacing';
```

- Use consistent spacing for better readability
