const { glob } = require('glob');
const path = require('path');
const fs = require('fs-extra');
const ignore = require('ignore');

/**
 * Default patterns to ignore when scanning
 */
const DEFAULT_IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  'coverage/**',
  '.next/**',
  '.nuxt/**',
  'out/**',
  '.cache/**',
  '**/*.min.js',
  '**/*.bundle.js'
];

/**
 * Scan a directory for JavaScript/TypeScript files
 * @param {string} rootPath - The root directory to scan
 * @param {Object} options - Scan options
 * @param {Array<string>} options.ignorePatterns - Additional patterns to ignore
 * @param {boolean} options.respectGitignore - Whether to respect .gitignore (default: true)
 * @returns {Promise<Array<string>>} Array of absolute file paths
 */
async function scanFiles(rootPath, options = {}) {
  const {
    ignorePatterns = [],
    respectGitignore = true
  } = options;

  // Build ignore instance
  const ig = ignore();
  
  // Add default ignore patterns
  ig.add(DEFAULT_IGNORE_PATTERNS);
  
  // Add custom ignore patterns
  if (ignorePatterns.length > 0) {
    ig.add(ignorePatterns);
  }
  
  // Read and add .gitignore patterns if exists
  if (respectGitignore) {
    const gitignorePath = path.join(rootPath, '.gitignore');
    if (await fs.pathExists(gitignorePath)) {
      try {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
        ig.add(gitignoreContent);
      } catch (error) {
        // Ignore errors reading .gitignore
      }
    }
  }

  // File patterns to match
  const patterns = [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
    '**/*.mjs',
    '**/*.cjs'
  ];

  // Find all matching files
  const allFiles = [];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, {
        cwd: rootPath,
        absolute: true,
        nodir: true,
        dot: false
      });
      allFiles.push(...files);
    } catch (error) {
      // Continue with other patterns if one fails
      console.error(`Error scanning pattern ${pattern}:`, error.message);
    }
  }

  // Filter out ignored files
  const filteredFiles = allFiles.filter(filePath => {
    const relativePath = path.relative(rootPath, filePath);
    // Use forward slashes for ignore patterns
    const normalizedPath = relativePath.split(path.sep).join('/');
    return !ig.ignores(normalizedPath);
  });

  // Remove duplicates (same file matched by multiple patterns)
  const uniqueFiles = [...new Set(filteredFiles)];

  return uniqueFiles;
}

/**
 * Get statistics about scanned files
 * @param {Array<string>} files - Array of file paths
 * @returns {Promise<Object>} Statistics object
 */
async function getFileStats(files) {
  let totalSize = 0;
  const extensions = {};

  for (const file of files) {
    try {
      const stats = await fs.stat(file);
      totalSize += stats.size;

      const ext = path.extname(file);
      extensions[ext] = (extensions[ext] || 0) + 1;
    } catch (error) {
      // Skip files that can't be accessed
    }
  }

  return {
    totalFiles: files.length,
    totalSize,
    extensions
  };
}

module.exports = {
  scanFiles,
  getFileStats,
  DEFAULT_IGNORE_PATTERNS
};
