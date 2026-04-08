# Coding Conventions: Deli-Cheap

## General Style
* **Indent:** 2 spaces.
* **Semicolons:** Always use.
* **Quotes:** Single quotes (except JSX).
* **Naming:** 
  * Variables/Functions: `camelCase`
  * Components: `PascalCase`
  * Constants: `UPPER_SNAKE_CASE`
  * Interfaces/Types: `PascalCase` (No 'I' prefix, except for global contexts).

## Functional Programming
* Prefer `const` over `let`.
* Use Arrow Functions for React Components.
* Use `Array.map`, `filter`, `reduce` for data transformations.

## Component Pattern
* Separated logic and UI (Custom Hooks for logic).
* Strictly typed props using TypeScript interfaces.
* Components should have JSDoc comments for complex logic.

## Error Handling
* Always use `try-catch` blocks in async/await functions.
* Graceful fallback for Deep Link failures.
