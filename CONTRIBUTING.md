# Contributing to dep-doctor

First off, thank you for considering contributing to dep-doctor! It's people like you that make dep-doctor such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct: be respectful, inclusive, and considerate.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, sample files)
- **Describe the behavior you observed** and what you expected
- **Include screenshots** if relevant
- **Specify your environment** (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** and add tests if applicable
4. **Ensure tests pass**: `npm test`
5. **Lint your code**: `npm run lint`
6. **Format your code**: `npm run format`
7. **Commit with clear messages** following conventional commits format
8. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Keep changes focused - one feature/fix per PR
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Follow the existing code style
- Write clear commit messages

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/dep-doctor.git
cd dep-doctor

# Install dependencies
npm install

# Link for local testing
npm link

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Testing Your Changes

### Manual Testing

```bash
# Link the package locally
npm link

# Test in another project
cd /path/to/test/project
dep-doctor scan
dep-doctor install --dry-run
```

### Automated Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Project Structure

```
dep-doctor/
├── bin/
│   └── cli.js          # CLI entry point
├── src/
│   ├── index.js        # Main module exports
│   ├── scanner.js      # File scanning logic
│   ├── parser.js       # Dependency parsing
│   ├── analyzer.js     # Dependency analysis
│   ├── installer.js    # Package installation
│   └── utils.js        # Utility functions
├── test/
│   ├── *.test.js       # Unit tests
│   └── fixtures/       # Test fixtures
└── package.json
```

## Code Style

We use ESLint and Prettier for code formatting:

- Use single quotes for strings
- Use semicolons
- 2-space indentation
- 100 character line length
- Prefer `const` over `let` when possible
- Use meaningful variable names
- Add comments for complex logic

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add support for .mts and .cts files
fix: handle circular dependencies correctly
docs: update installation instructions
test: add tests for parser edge cases
refactor: simplify dependency extraction logic
chore: update dependencies
```

## Release Process

Maintainers will handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Publish to npm
5. Create GitHub release

## Questions?

Feel free to open an issue with the `question` label if you have questions about contributing!

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes (for significant contributions)

Thank you for contributing! 🎉
