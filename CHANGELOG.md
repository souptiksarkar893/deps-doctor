# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release
- File scanner to detect JavaScript/TypeScript files
- Dependency parser for CommonJS and ES6 modules
- Auto-detection and reporting of missing dependencies
- Auto-install functionality
- Support for npm, yarn, and pnpm
- CLI interface with scan, install, and fix commands

## [0.1.0] - 2025-12-03

### Changed
- **BREAKING**: Rebranded from `@souptik_sarkar/dep-doctor` to `deps-doctor`
- Changed package name to unscoped `deps-doctor` for easier installation
- Updated repository URL to https://github.com/souptiksarkar893/deps-doctor
- Changed primary command from `dep-doctor` to `deps-doctor`
- Short alias `depdoc` still available for convenience

### Migration Guide
If you were using the old scoped package:
```bash
npm uninstall -g @souptik_sarkar/dep-doctor
npm install -g deps-doctor
```

### Added
- First public release of deps-doctor
- File scanner to detect JavaScript/TypeScript files
- Dependency parser for CommonJS and ES6 modules
- Auto-detection and reporting of missing dependencies
- Auto-install functionality
- Support for npm, yarn, and pnpm
- CLI interface with scan, install, and fix commands
- Unused dependency detection
