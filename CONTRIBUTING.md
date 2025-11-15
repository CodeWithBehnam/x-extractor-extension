# Contributing to X.com Data Extractor 🤝

Thank you for considering contributing to X.com Data Extractor! We welcome contributions from everyone. This document provides guidelines to help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Git Workflow](#git-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Code Review Process](#code-review-process)
- [Style Guide](#style-guide)

## 📜 Code of Conduct

We expect all contributors to be respectful and constructive. Please:

- Be welcoming and inclusive
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## 🚀 Getting Started

### Development Prerequisites

- **Node.js** 16+ or **Bun** latest
- **Git** 2.0+
- **Google Chrome** 90+
- **Code Editor** (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/x-extractor-extension.git
   cd x-extractor-extension
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/behnamebrahimi/x-extractor-extension.git
   ```

## 💻 Development Setup

### Install Dependencies

```bash
# Using npm
npm install

# Using bun
bun install
```

### Build the Extension

```bash
# Development build (with watch)
npm run dev

# Production build
npm run build
```

### Load in Chrome

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

### Run Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Run specific test file
npm test -- src/__tests__/timeAggregation.test.js
```

## 🔨 Making Changes

### Finding Issues to Work On

- Check [Good First Issues](https://github.com/behnamebrahimi/x-extractor-extension/labels/good%20first%20issue)
- Look for [Help Wanted](https://github.com/behnamebrahimi/x-extractor-extension/labels/help%20wanted) labels
- Browse [Open Issues](https://github.com/behnamebrahimi/x-extractor-extension/issues)

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Comment on the issue** to let others know you're working on it
3. **Ask questions** if anything is unclear

### Making Your Changes

1. Create a new branch (see [Git Workflow](#git-workflow))
2. Make your changes in the `src/` directory
3. Write tests for new features
4. Update documentation as needed
5. Test your changes thoroughly

## 🌿 Git Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-heatmap-view`)
- `fix/` - Bug fixes (e.g., `fix/csv-export-encoding`)
- `docs/` - Documentation changes (e.g., `docs/update-installation-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/extract-chart-utils`)
- `test/` - Test improvements (e.g., `test/add-analytics-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Example Workflow

```bash
# Fetch latest changes
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/my-awesome-feature

# Make changes and commit
git add .
git commit -m "feat: add awesome feature"

# Push to your fork
git push origin feature/my-awesome-feature

# Create Pull Request on GitHub
```

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Feature
feat(analytics): add heatmap visualization

# Bug fix
fix(extractor): handle null timestamps correctly

# Documentation
docs(readme): update installation instructions

# Multiple changes
feat(analytics): add export to PDF

- Implement PDF generation
- Add export button to UI
- Update tests

Closes #123
```

### Rules

- Use imperative mood ("add" not "added" or "adds")
- First line should be ≤72 characters
- Include issue number if applicable
- Separate subject from body with blank line

## 🔄 Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with `main`

### Submitting a PR

1. **Push your branch** to your fork
2. **Create Pull Request** on GitHub
3. **Fill out the PR template** completely
4. **Link related issues** using keywords (Fixes #123, Closes #456)
5. **Request review** from maintainers

### PR Title Format

Follow the same format as commit messages:

```
feat(scope): add new feature
fix(scope): resolve bug in component
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🧪 Testing Requirements

### Test Coverage

- All new features must have tests
- Bug fixes should include regression tests
- Aim for >80% code coverage

### Writing Tests

```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils/myModule';

describe('myFunction', () => {
  it('should handle valid input', () => {
    const result = myFunction('valid');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Running Specific Tests

```bash
# Run specific file
npm test -- src/__tests__/extractor.test.js

# Run tests matching pattern
npm test -- --grep "aggregation"

# Run with coverage
npm test -- --coverage
```

## 👀 Code Review Process

### What to Expect

1. **Initial Review**: Within 2-3 business days
2. **Feedback**: Constructive comments and suggestions
3. **Iterations**: May require multiple rounds of changes
4. **Approval**: At least one maintainer approval required
5. **Merge**: Maintainers will merge once approved

### Review Criteria

- **Functionality**: Code works as intended
- **Tests**: Adequate test coverage
- **Style**: Follows project conventions
- **Documentation**: Clear and up-to-date
- **Performance**: No significant performance regressions

### Addressing Feedback

- Respond to all comments
- Make requested changes promptly
- Ask questions if unclear
- Push updates to the same branch
- Mark conversations as resolved when addressed

## 🎨 Style Guide

### JavaScript/React

- Use functional components with hooks
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Destructure props and state
- Keep components small and focused

```javascript
// Good
const MyComponent = ({ data, onUpdate }) => {
  const [state, setState] = useState(initial);
  
  const handleClick = () => {
    onUpdate(state);
  };
  
  return <div onClick={handleClick}>{data}</div>;
};

// Avoid
function MyComponent(props) {
  let myState = useState(props.initial);
  return <div>{props.data}</div>;
}
```

### CSS

- Use meaningful class names
- Follow BEM-like naming
- Keep specificity low
- Use CSS variables for theming

```css
/* Good */
.chart-container {
  padding: var(--spacing-md);
}

.chart-container__title {
  font-size: var(--font-size-lg);
}

/* Avoid */
div.container > div {
  padding: 15px;
}
```

### File Organization

- One component per file
- Group related files together
- Use index files for exports
- Keep utils separate from components

## 🐛 Reporting Bugs

### Before Reporting

- Search existing issues
- Test with latest version
- Reproduce the bug consistently

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what's wrong

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: Chrome 120
- Extension version: 1.0.0
- OS: macOS 14

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem

**Describe the solution**
What you'd like to see

**Describe alternatives**
Other options you've considered

**Additional context**
Mockups, examples, etc.
```

## 🏆 Recognition

Contributors will be:

- Listed in the README
- Mentioned in release notes
- Given credit in commit history

## 📚 Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

## ❓ Questions?

- Open a [Discussion](https://github.com/behnamebrahimi/x-extractor-extension/discussions)
- Comment on relevant [Issues](https://github.com/behnamebrahimi/x-extractor-extension/issues)
- Reach out to maintainers

---

**Thank you for contributing! Your efforts help make this project better for everyone.** 🎉
