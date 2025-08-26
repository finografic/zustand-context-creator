// .simple-git-hooks.js
export default {
  'pre-commit': 'pnpm typecheck && npx lint-staged',
};
