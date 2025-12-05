# Cursor Rules File Structure

## Overview

This project uses a two-tier system for Cursor AI Assistant rules:

1. **`.cursorrules`** - Root level, global rules for the workspace
2. **`.cursor/rules/`** - Project-specific rule files, organized by topic

## File Organization

### `.cursorrules` (Root File)

**Location**: Root of the package (`.cursorrules`)

**Purpose**: Global package guidelines that apply to ALL interactions with this package

**Content Categories**:
- Package development policies
- Development workflow principles
- High-level project structure guidelines
- Meta-instructions for how the AI should approach tasks

**Example Rules**:

```
- DO NOT start development servers unless requested
- Use TypeScript throughout
- Focus on reusable, well-typed utilities
- Follow existing patterns and conventions
```

**When to Add Rules Here**:
- ✅ Applies to the entire package
- ✅ Fundamental principles (DO/DON'T policies)
- ✅ Development workflow rules
- ✅ Package structure guidelines
- ❌ Specific code patterns (use `.cursor/rules/` instead)
- ❌ Tool-specific configurations
- ❌ Implementation details

---

### `.cursor/rules/` (Folder with Numbered Files)

**Location**: `.cursor/rules/` (in the package root)

**Purpose**: Detailed, package-specific coding standards and patterns

**Organization Pattern**:
- Files are numbered with a prefix (00-, 01-, 02-, etc.)
- Prefix indicates category/priority
- Topics ordered logically

**Current Files**:
- `00-general.md` - General coding principles
- `01-file-naming.md` - File/folder naming conventions
- `02-typescript-patterns.md` - TypeScript best practices
- `03-provider-context-patterns.md` - Zustand/Context patterns (core to this package)
- `04-eslint-code-style.md` - ESLint configuration rules
- `05-documentation.md` - Documentation standards
- `06-modern-typescript-patterns.md` - Advanced TypeScript patterns

**When to Add Rules Here**:
- ✅ Specific to this package's codebase
- ✅ Code style and patterns
- ✅ Tool configurations (ESLint, Prettier, etc.)
- ✅ TypeScript patterns and conventions
- ✅ Directory structure guidelines
- ✅ Package-specific patterns (e.g., Zustand store creation)
- ❌ Package-wide policies (use `.cursorrules`)

---

## Decision Matrix: Where Does a Rule Go?

| Rule Type | `.cursorrules` | `.cursor/rules/` | Example |
|-----------|---|---|---|
| **Process/Workflow** | ✅ | ❌ | "Don't start dev servers" |
| **Code Patterns** | ❌ | ✅ | "Use named parameters" |
| **Tool Config** | ❌ | ✅ | "ESLint import sorting" |
| **Package Structure** | ✅ | ❌ | "Source in src/, build in dist/" |
| **Naming Conventions** | ❌ | ✅ | "File naming patterns" |
| **Fundamental Principles** | ✅ | ❌ | "Use TypeScript" |
| **Package-Specific Patterns** | ❌ | ✅ | "Zustand store creation patterns" |
| **Type Definitions** | ❌ | ✅ | "TypeScript interface patterns" |

---

## File Naming Convention

### Root File

- **Single file**: `.cursorrules` (no extension, hidden dotfile)

### Rule Folder Files

- **Naming**: `NN-topic-name.md` where NN is a two-digit number
- **Pattern**: Numbers indicate category/order
  - `00-09`: Foundational rules
  - `10-29`: Language/framework specific
  - `30-59`: Feature-specific patterns
  - `60-89`: Advanced topics
  - `90-99`: Reference/architecture

### Subdirectories in `.cursor/`

- **`rules/`** - The main rules folder
- **`chats/`** - Archived conversation summaries (auto-generated, don't edit)

---

## Content Guidelines

### Rule File Structure

Each rule file should have:

1. **Main heading**: `# Topic Area`
2. **Sections**: Subsections for related rules
3. **Examples**: Both ✅ correct and ❌ incorrect patterns
4. **Code blocks**: With language syntax highlighting
5. **Guidelines**: When/why to apply the rule

### Example Template

```markdown
# Feature Area

## Rule Category

### Specific Pattern

- **DO** this when...
- **DON'T** this because...

\`\`\`typescript
// ✅ Correct
const example = () => { }

// ❌ Avoid
const example = () => { }
\`\`\`

### Benefits
- Reason 1
- Reason 2
```

---

## How the AI Uses These Rules

1. **Reads `.cursorrules`** first - understands workspace constraints
2. **Reads `.cursor/rules/` files** - applies project-specific patterns
3. **Orders by filename** - respects the numbered organization
4. **Applies contextually** - uses relevant rules for the current task

When you ask me to:
- ✅ "Create a new store" → I check `03-provider-context-patterns.md`
- ✅ "Fix the build" → I check `.cursorrules` for process rules
- ✅ "Sort imports" → I check `04-eslint-code-style.md`
- ✅ "Add types" → I check `02-typescript-patterns.md`
- ✅ "Name a file" → I check `01-file-naming.md`
- ✅ "Document code" → I check `05-documentation.md`

---

## Maintenance Tips

1. **Keep `.cursorrules` lean** - Only fundamental policies
2. **Update `.cursor/rules/` frequently** - Add patterns as you discover them
3. **Link related rules** - Cross-reference rules in different files
4. **Number new files** - Follow the NN- prefix convention
5. **Archive old chat summaries** - Clean up `.cursor/chats/` periodically

---

## Package-Specific Notes

This package (`@finografic/zustand-context-creator`) is a utility library for creating Zustand stores with React Context integration. The rules focus on:

- **TypeScript patterns** - Type safety and inference
- **Zustand/Context patterns** - Store creation and provider patterns
- **Code quality** - Clean, maintainable utility code
- **Documentation** - Clear API documentation for library users

