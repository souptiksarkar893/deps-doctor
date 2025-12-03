# 🩺 deps-doctor

> Automatically detect and fix missing Node.js dependencies by scanning your codebase

[![npm version](https://img.shields.io/npm/v/deps-doctor.svg)](https://www.npmjs.com/package/deps-doctor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/deps-doctor.svg)](https://nodejs.org)

## 🤔 The Problem

Ever encountered these frustrating errors?

```
Error: Cannot find module 'lodash'
Module not found: Can't resolve 'axios'
Error: Cannot find module '@babel/parser'
```

You pull a repository, start coding, and suddenly realize dependencies are missing. Or worse, you import a package, forget to install it, and discover the error much later.

**deps-doctor** solves this by automatically scanning your code, detecting missing dependencies, and installing them for you!

## ✨ The Solution

```bash
# Scan your project for missing dependencies
npx deps-doctor scan

# Automatically install all missing dependencies
npx deps-doctor install

# Find unused dependencies
npx deps-doctor unused
```

## 🚀 Features

- ✅ **Automatic Detection** - Scans all JavaScript/TypeScript files
- ✅ **Smart Parsing** - Uses AST parsing to accurately detect imports
- ✅ **Multiple Import Styles** - Supports `require()`, `import`, and dynamic `import()`
- ✅ **Package Manager Detection** - Works with npm, yarn, and pnpm
- ✅ **Respects .gitignore** - Won't scan files you don't want
- ✅ **Find Unused Dependencies** - Detect packages you're not using
- ✅ **Beautiful CLI** - Clean, colored output with progress indicators
- ✅ **Zero Config** - Works out of the box

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g deps-doctor
```

Then use it anywhere:

```bash
deps-doctor scan
deps-doctor install
```

### No Installation (Using npx)

```bash
npx deps-doctor scan
npx deps-doctor install
```

### Local Installation

```bash
npm install --save-dev deps-doctor
```

Then add to `package.json` scripts:

```json
{
  "scripts": {
    "check-deps": "deps-doctor scan",
    "fix-deps": "deps-doctor install"
  }
}
```

## 📖 Usage

### Scan for Missing Dependencies

Scan your project and get a report of missing dependencies:

```bash
deps-doctor scan
```

**Output:**
```
✓ Scan complete!

📊 Summary:
  Files scanned: 45
  Dependencies found: 23
  Dependencies installed: 20
  Dependencies missing: 3

❌ 3 missing dependencies found:

  1. lodash
     Used in 5 file(s)

  2. axios
     Used in 3 file(s)

  3. chalk
     Used in 1 file(s)

💡 To install missing dependencies, run:
   deps-doctor install
```

### Scan with Verbose Output

See exactly where each dependency is used:

```bash
deps-doctor scan --verbose
```

**Output:**
```
  1. lodash
     Used in 5 file(s)
       → src/utils.js
       → src/helpers.js
       → src/formatter.js
       → src/validator.js
       → src/processor.js
```

### Automatically Install Missing Dependencies

Scan and automatically install all missing dependencies:

```bash
deps-doctor install
```

Or use the alias:

```bash
deps-doctor fix
```

**Output:**
```
✓ Installation complete!

✅ Successfully installed 3 package(s):
  ✓ lodash
  ✓ axios
  ✓ chalk

Using: npm
```

### Install as Dev Dependencies

```bash
deps-doctor install --save-dev
```

Or shorter:

```bash
deps-doctor install -D
```

### Dry Run

See what would be installed without actually installing:

```bash
deps-doctor install --dry-run
```

### Find Unused Dependencies

Find dependencies that are installed but never imported:

```bash
deps-doctor unused
```

**Output:**
```
✓ Scan complete!

⚠️  2 unused dependencies found:

  1. moment
  2. jquery

💡 You can remove them with:
   npm uninstall moment jquery
```

### Scan Specific Directory

```bash
deps-doctor scan --path ./my-project
deps-doctor install --path ./my-project
```

### Ignore Additional Patterns

```bash
deps-doctor scan --ignore "**/*.test.js" "**/*.spec.js"
```

### Don't Respect .gitignore

```bash
deps-doctor scan --no-gitignore
```

## 🎯 Use Cases

### 1. After Pulling a Repository

```bash
git pull origin main
deps-doctor install
```

Automatically install any new dependencies added by teammates.

### 2. Before Committing

```bash
deps-doctor scan
git commit -m "Add new feature"
```

Make sure all dependencies are properly installed.

### 3. Cleaning Up

```bash
# Find and remove unused dependencies
deps-doctor unused
npm uninstall unused-package-1 unused-package-2
```

### 4. CI/CD Pipeline

Add to your `.github/workflows/ci.yml`:

```yaml
- name: Check dependencies
  run: npx deps-doctor scan
```

### 5. Pre-commit Hook

Using husky:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "deps-doctor scan"
    }
  }
}
```

## 🔧 How It Works

1. **File Scanning** - Recursively finds all `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, and `.cjs` files
2. **AST Parsing** - Uses Babel parser to accurately extract import statements
3. **Dependency Extraction** - Identifies:
   - `import x from 'package'` (ES6)
   - `require('package')` (CommonJS)
   - `import('package')` (Dynamic imports)
   - `export { x } from 'package'` (Re-exports)
4. **Smart Filtering** - Excludes:
   - Node.js built-ins (`fs`, `path`, etc.)
   - Relative imports (`./utils`, `../config`)
   - Files in `node_modules`, `.git`, `dist`, etc.
5. **Analysis** - Compares found dependencies against `package.json`
6. **Installation** - Detects your package manager and installs missing packages

## 🎨 CLI Commands

### `deps-doctor scan`

Scan project and report missing dependencies.

**Options:**
- `-p, --path <path>` - Project path to scan (default: current directory)
- `-v, --verbose` - Show detailed output including file locations
- `--ignore <patterns...>` - Additional patterns to ignore
- `--no-gitignore` - Do not respect .gitignore

### `deps-doctor install` (alias: `fix`)

Scan and automatically install missing dependencies.

**Options:**
- `-p, --path <path>` - Project path to scan (default: current directory)
- `-D, --save-dev` - Install as devDependencies
- `--dry-run` - Show what would be installed without installing
- `--ignore <patterns...>` - Additional patterns to ignore
- `--no-gitignore` - Do not respect .gitignore

### `deps-doctor unused`

Find dependencies that are installed but not used.

**Options:**
- `-p, --path <path>` - Project path to scan (default: current directory)

## 📋 Supported Import Patterns

deps-doctor recognizes all common import patterns:

```javascript
// ES6 Imports
import lodash from 'lodash';
import { map } from 'lodash';
import * as _ from 'lodash';

// CommonJS
const lodash = require('lodash');
const { map } = require('lodash');

// Dynamic Imports
const lodash = await import('lodash');
import('lodash').then(module => { ... });

// Re-exports
export { map } from 'lodash';
export * from 'lodash';

// Scoped Packages
import parser from '@babel/parser';
const parser = require('@babel/parser');

// Subpath Imports
import map from 'lodash/map';
const map = require('lodash/map');
```

## ⚙️ Configuration

deps-doctor works with zero configuration, but you can customize behavior using CLI flags.

### Ignoring Files

Create a `.gitignore` (automatically respected):

```
node_modules/
dist/
*.test.js
```

Or use `--ignore` flag:

```bash
deps-doctor scan --ignore "**/*.test.js" "build/**"
```

### Package Manager

deps-doctor automatically detects your package manager:

- `npm` - if `package-lock.json` exists
- `yarn` - if `yarn.lock` exists
- `pnpm` - if `pnpm-lock.yaml` exists

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/souptiksarkar893/deps-doctor.git
cd deps-doctor

# Install dependencies
npm install

# Link for local testing
npm link

# Run tests
npm test

# Lint code
npm run lint
```

### Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

## 📝 License

MIT © [Souptik Sarkar](https://github.com/souptiksarkar893)

## 🙏 Acknowledgments

- Built with [Babel Parser](https://babeljs.io/docs/en/babel-parser) for accurate AST parsing
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
- Beautiful terminal output with [Chalk](https://github.com/chalk/chalk) and [Ora](https://github.com/sindresorhus/ora)

## 📊 Stats

- **Zero** dependencies on deprecated packages
- **100%** JavaScript (no compilation needed)
- **< 1MB** package size
- **Works** with Node.js 14+

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/deps-doctor)
- [GitHub Repository](https://github.com/souptiksarkar893/deps-doctor)
- [Issue Tracker](https://github.com/souptiksarkar893/deps-doctor/issues)
- [Changelog](https://github.com/souptiksarkar893/deps-doctor/blob/main/CHANGELOG.md)

## ❓ FAQ

### Why use deps-doctor instead of npm install?

deps-doctor helps you **discover** missing dependencies by scanning your code. It's useful when:
- You forgot to save a dependency after installing
- You imported a package but never installed it
- You pulled code from someone who forgot to commit package.json changes
- You want to find unused dependencies

### Does it work with TypeScript?

Yes! deps-doctor fully supports TypeScript files (`.ts`, `.tsx`).

### Does it work with monorepos?

Yes! Point it to any directory with a `package.json`.

### Will it break my project?

No. deps-doctor only:
1. **Reads** your code to find imports
2. **Reads** your package.json
3. **Installs** packages using your package manager (just like running `npm install` manually)

Use `--dry-run` to see what would be installed without making changes.

### What about dynamic requires with variables?

```javascript
const pkg = 'lodash';
require(pkg); // Won't be detected
```

deps-doctor only detects static imports (string literals). Dynamic requires with variables can't be reliably detected.

### Can I use this in CI/CD?

Yes! Add to your workflow:

```bash
npx deps-doctor scan
```

This will fail if missing dependencies are found.

---

**Made with ❤️ by developers, for developers**

If deps-doctor saved you time, please give it a ⭐ on GitHub!
