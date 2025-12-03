# 🚀 Quick Start Guide - deps-doctor

Get up and running with deps-doctor in under 2 minutes!

## Installation

### Option 1: No Installation Required (Recommended for First Try)

```bash
npx deps-doctor scan
```

This runs deps-doctor without installing it globally.

### Option 2: Global Installation

```bash
npm install -g deps-doctor
```

Then use it anywhere:
```bash
deps-doctor scan
deps-doctor install
```

### Option 3: Project-Specific Installation

```bash
npm install --save-dev deps-doctor
```

Add to package.json:
```json
{
  "scripts": {
    "check-deps": "deps-doctor scan",
    "fix-deps": "deps-doctor install"
  }
}
```

## Basic Usage

### 1. Scan Your Project

Navigate to your project directory:
```bash
cd /path/to/your/project
```

Run a scan:
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
  1. lodash (Used in 5 files)
  2. axios (Used in 3 files)
  3. chalk (Used in 1 file)
```

### 2. Install Missing Dependencies

If missing dependencies are found:
```bash
deps-doctor install
```

**Output:**
```
✓ Installation complete!

✅ Successfully installed 3 package(s):
  ✓ lodash
  ✓ axios
  ✓ chalk
```

### 3. Check for Unused Dependencies (Bonus)

Find packages you're not using:
```bash
deps-doctor unused
```

## Common Workflows

### After Pulling Code

```bash
git pull origin main
deps-doctor install
```

### Before Committing

```bash
deps-doctor scan
# Fix any issues
git commit -m "Your message"
```

### Clean Up Unused Packages

```bash
deps-doctor unused
# Review the list
npm uninstall package1 package2 ...
```

## Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `scan` | Check for missing dependencies | `deps-doctor scan` |
| `install` | Install missing dependencies | `deps-doctor install` |
| `fix` | Alias for install | `deps-doctor fix` |
| `unused` | Find unused dependencies | `deps-doctor unused` |

## Useful Flags

| Flag | Description | Example |
|------|-------------|---------|
| `-v, --verbose` | Show file locations | `deps-doctor scan -v` |
| `-D, --save-dev` | Install as devDependencies | `deps-doctor install -D` |
| `--dry-run` | Preview without installing | `deps-doctor install --dry-run` |
| `-p, --path <path>` | Scan specific directory | `deps-doctor scan -p ./src` |
| `--ignore <patterns>` | Ignore file patterns | `deps-doctor scan --ignore "*.test.js"` |

## Examples

### Example 1: Verbose Scan
```bash
deps-doctor scan --verbose
```

Shows exactly where each dependency is used:
```
1. lodash
   Used in 5 file(s)
     → src/utils.js
     → src/helpers.js
     → src/formatter.js
     → src/validator.js
     → src/processor.js
```

### Example 2: Dry Run Installation
```bash
deps-doctor install --dry-run
```

Preview what would be installed:
```
🔍 Dry Run Mode - Would install:
  → lodash
  → axios
  → chalk
```

### Example 3: Install as Dev Dependencies
```bash
deps-doctor install --save-dev
```

Installs packages to `devDependencies` section of package.json.

### Example 4: Scan Specific Directory
```bash
deps-doctor scan --path ./backend
```

Only scans the `backend` directory.

### Example 5: Ignore Test Files
```bash
deps-doctor scan --ignore "**/*.test.js" "**/*.spec.js"
```

Excludes test files from the scan.

## What deps-doctor Detects

✅ **Supported Import Styles:**
```javascript
// ES6 imports
import lodash from 'lodash';
import { map } from 'lodash';

// CommonJS
const lodash = require('lodash');

// Dynamic imports
const module = await import('lodash');

// Re-exports
export { map } from 'lodash';
```

✅ **Supported File Types:**
- `.js` - JavaScript
- `.jsx` - React
- `.ts` - TypeScript
- `.tsx` - TypeScript + React
- `.mjs` - ES Modules
- `.cjs` - CommonJS

❌ **What's Ignored:**
- Node.js built-ins (`fs`, `path`, etc.)
- Relative imports (`./utils`, `../config`)
- Files in `node_modules/`, `.git/`, `dist/`, etc.

## Troubleshooting

### "No package.json found"
**Solution:** Make sure you're in a project directory with a package.json file. If not, run `npm init` first.

### "No files found"
**Solution:** Check that your project has .js/.ts files. Use `--no-gitignore` if files are being ignored.

### Package manager not detected
**Solution:** Make sure npm, yarn, or pnpm is installed and accessible in your PATH.

### Dependencies still missing after install
**Solution:** Check your internet connection. Try running the install command manually to see the full error.

## Tips & Best Practices

1. **Run scan regularly** - Catch missing dependencies early
2. **Use --dry-run first** - Preview changes before installing
3. **Check unused dependencies** - Keep your package.json clean
4. **Add to CI/CD** - Prevent missing dependencies in production
5. **Use in pre-commit hooks** - Enforce dependency checks

## Integration Examples

### With npm scripts (package.json)
```json
{
  "scripts": {
    "pretest": "deps-doctor scan",
    "postinstall": "deps-doctor scan",
    "clean": "deps-doctor unused"
  }
}
```

### With Husky (pre-commit)
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "deps-doctor scan"
    }
  }
}
```

### With GitHub Actions
```yaml
- name: Check dependencies
  run: npx deps-doctor scan
```

## Next Steps

- Read the full [README](README.md) for advanced usage
- Check out [CONTRIBUTING](CONTRIBUTING.md) to contribute
- Report issues on [GitHub](https://github.com/yourusername/deps-doctor/issues)

## Get Help

- 📖 [Full Documentation](README.md)
- 🐛 [Report a Bug](https://github.com/yourusername/deps-doctor/issues)
- 💬 [Ask a Question](https://github.com/yourusername/deps-doctor/discussions)
- ⭐ [Star on GitHub](https://github.com/yourusername/deps-doctor)

---

**Happy coding! 🎉**

If deps-doctor helped you, please consider giving it a ⭐ on GitHub!
