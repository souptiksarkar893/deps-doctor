# Publishing Guide for dep-doctor

This guide will walk you through publishing `dep-doctor` to npm.

## Pre-Publishing Checklist

### 1. Code Quality
- [x] All tests passing (`npm test`)
- [x] No linting errors (`npm run lint`)
- [x] Code formatted (`npm run format`)
- [ ] No security vulnerabilities (`npm audit`)

### 2. Documentation
- [x] README.md complete and accurate
- [x] All examples tested
- [x] CHANGELOG.md updated
- [x] LICENSE file included
- [x] CONTRIBUTING.md included

### 3. Package Configuration
- [x] package.json properly configured
- [x] `bin` field points to CLI
- [x] `files` field specifies what to include
- [x] Keywords added for discoverability
- [ ] Repository URL updated (change to your actual GitHub repo)
- [ ] Author name updated
- [x] Version set to 0.1.0 for beta release

### 4. Testing
- [x] Tested locally with `npm link`
- [x] CLI commands work correctly
- [ ] Tested on different operating systems (if possible)
- [ ] Manual end-to-end testing completed

## Step-by-Step Publishing Process

### Step 1: Update Package.json

Update these fields in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/dep-doctor.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/dep-doctor/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/dep-doctor#readme"
}
```

### Step 2: Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create a free account
3. Verify your email address
4. **IMPORTANT**: Enable two-factor authentication (2FA)
   - Go to Account Settings → Two-Factor Authentication
   - Use an authenticator app (Google Authenticator, Authy, etc.)

### Step 3: Login to npm

```bash
npm login
```

Enter:
- Username
- Password
- Email
- 2FA code (from authenticator app)

Verify you're logged in:
```bash
npm whoami
```

### Step 4: Final Checks

Run these commands before publishing:

```bash
# Check for security vulnerabilities
npm audit

# Dry run to see what will be published
npm publish --dry-run
```

Review the output carefully. Make sure:
- Only necessary files are included
- node_modules is excluded
- Test files are excluded
- File sizes are reasonable

### Step 5: Publish to npm

**For first-time publishing:**

```bash
npm publish --access public
```

Note: Use `--access public` if your package name is scoped (e.g., `@yourusername/dep-doctor`)

**Expected output:**
```
+ dep-doctor@0.1.0
```

### Step 6: Verify Publication

1. **Check on npm:**
   - Go to https://www.npmjs.com/package/dep-doctor
   - Your package should appear within seconds

2. **Test installation:**
   ```bash
   # In a different directory
   npx dep-doctor --version
   ```

3. **Test global installation:**
   ```bash
   npm install -g dep-doctor
   dep-doctor --version
   ```

### Step 7: Create Git Repository

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial release v0.1.0"

# Create GitHub repository (on github.com)
# Then connect local to remote:
git remote add origin https://github.com/YOUR_USERNAME/dep-doctor.git

# Push
git branch -M main
git push -u origin main

# Create tag for release
git tag v0.1.0
git push --tags
```

### Step 8: Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Choose tag: `v0.1.0`
4. Release title: `v0.1.0 - Initial Release`
5. Description:
   ```markdown
   ## 🎉 First Release!
   
   dep-doctor automatically detects and fixes missing Node.js dependencies.
   
   ### Features
   - 🔍 Scan projects for missing dependencies
   - 🔧 Auto-install missing packages
   - 📊 Find unused dependencies
   - 🎨 Beautiful CLI interface
   
   ### Installation
   ```bash
   npm install -g dep-doctor
   ```
   
   ### Usage
   ```bash
   dep-doctor scan
   dep-doctor install
   ```
   
   See [README](https://github.com/YOUR_USERNAME/dep-doctor#readme) for full documentation.
   ```

## Post-Publishing Tasks

### 1. Add Badges to README

Update README.md with actual badges:

```markdown
[![npm version](https://img.shields.io/npm/v/dep-doctor.svg)](https://www.npmjs.com/package/dep-doctor)
[![npm downloads](https://img.shields.io/npm/dm/dep-doctor.svg)](https://www.npmjs.com/package/dep-doctor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 2. Share Your Package

**Day 1 - Soft Launch:**
- Tweet about it
- Post on LinkedIn
- Share with friends and ask for feedback

**Day 2-3 - Reddit:**
- r/javascript
- r/node
- r/webdev

Template:
```
Title: "I built dep-doctor - automatically fix 'Cannot find module' errors"

I got tired of seeing "Cannot find module" errors, so I built a tool that 
automatically scans your code and installs missing dependencies.

Features:
- Scans JS/TS files and detects all imports
- Compares against package.json
- Auto-installs missing packages
- Works with npm, yarn, and pnpm

Try it: npx dep-doctor scan

Feedback welcome! [GitHub link]
```

**Day 4-5 - Dev.to Article:**
Write a blog post about building the package

**Day 6-7 - Submit to Newsletters:**
- JavaScript Weekly: https://javascriptweekly.com
- Node Weekly: https://nodeweekly.com

### 3. Monitor and Respond

- Watch your GitHub repository for issues
- Respond to questions promptly
- Track download statistics on npm

## Updating Your Package

When you need to publish an update:

### For Bug Fixes (Patch: 0.1.0 → 0.1.1)

```bash
# Fix the bug
# Update tests
npm test

# Update CHANGELOG.md
# Bump version
npm version patch

# Publish
npm publish

# Push to GitHub
git push && git push --tags
```

### For New Features (Minor: 0.1.0 → 0.2.0)

```bash
# Implement feature
# Add tests
npm test

# Update README and CHANGELOG
# Bump version
npm version minor

# Publish
npm publish

# Push to GitHub
git push && git push --tags
```

### For Breaking Changes (Major: 0.1.0 → 1.0.0)

```bash
# Implement changes
# Update all affected tests and docs

# Bump version
npm version major

# Publish
npm publish

# Push to GitHub
git push && git push --tags

# Announce breaking changes clearly
```

## Common Issues and Solutions

### Issue: "You do not have permission to publish"
**Solution:** Make sure you're logged in with correct account and package name is available

### Issue: "Package name too similar to existing package"
**Solution:** Choose a different, more unique name

### Issue: "Version already exists"
**Solution:** Bump version number before publishing

### Issue: Package seems too large
**Solution:** Check .npmignore and make sure test files, docs, etc. are excluded

## Monitoring Success

Track these metrics:

- **npm downloads:** https://www.npmjs.com/package/dep-doctor
- **GitHub stars:** Watch your repository
- **Issues/Questions:** Respond within 24-48 hours
- **Dependencies:** Keep them updated

## Marketing Timeline

**Week 1:**
- Publish to npm ✓
- Create GitHub repo ✓
- Share on Twitter/LinkedIn
- Post on Reddit (2-3 subreddits)

**Week 2:**
- Write Dev.to blog post
- Submit to JavaScript Weekly
- Answer any issues/questions

**Week 3:**
- Product Hunt launch (if 100+ downloads)
- Create demo GIF/video
- Update README with stats

**Month 2-3:**
- Build integrations (VSCode extension?)
- Add to awesome lists
- Consider premium features

## Legal Considerations

- ✓ MIT License included (permissive, popular)
- ✓ No proprietary code
- ✓ All dependencies have compatible licenses
- ✓ No trademark violations

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [shields.io](https://shields.io/) - For badges

## Need Help?

- npm support: https://www.npmjs.com/support
- GitHub issues: Use for bug reports
- Stack Overflow: Tag with [npm] [node.js]

---

**Good luck with your launch! 🚀**

Remember: Even 100 weekly downloads means you're helping developers. Every user counts!
