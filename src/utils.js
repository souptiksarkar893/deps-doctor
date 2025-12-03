const fs = require('fs-extra');
const path = require('path');

/**
 * Node.js built-in modules that should not be considered as npm packages
 */
const BUILTIN_MODULES = new Set([
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https',
  'module', 'net', 'os', 'path', 'punycode', 'querystring', 'readline',
  'repl', 'stream', 'string_decoder', 'sys', 'timers', 'tls', 'tty',
  'url', 'util', 'v8', 'vm', 'zlib', 'process', 'async_hooks', 'http2',
  'perf_hooks', 'trace_events', 'worker_threads', 'inspector'
]);

/**
 * Check if a module is a Node.js built-in module
 * @param {string} moduleName - The module name to check
 * @returns {boolean} True if it's a built-in module
 */
function isBuiltinModule(moduleName) {
  // Handle node: protocol (e.g., 'node:fs')
  if (moduleName.startsWith('node:')) {
    return true;
  }
  
  // Check against built-in modules set
  return BUILTIN_MODULES.has(moduleName);
}

/**
 * Check if a module path is a relative import (local file)
 * @param {string} moduleName - The module name to check
 * @returns {boolean} True if it's a relative import
 */
function isRelativeImport(moduleName) {
  return moduleName.startsWith('.') || moduleName.startsWith('/') || moduleName.startsWith('\\');
}

/**
 * Extract the package name from a module path
 * Handles scoped packages like @babel/parser
 * @param {string} modulePath - The module path (e.g., 'lodash/map' or '@babel/parser/lib')
 * @returns {string} The package name
 */
function extractPackageName(modulePath) {
  // Handle scoped packages (@org/package)
  if (modulePath.startsWith('@')) {
    const parts = modulePath.split('/');
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    return modulePath;
  }
  
  // Regular packages - take first part before /
  const parts = modulePath.split('/');
  return parts[0];
}

/**
 * Find package.json by walking up the directory tree
 * @param {string} startPath - The path to start searching from
 * @returns {string|null} The path to package.json or null if not found
 */
async function findPackageJson(startPath) {
  let currentPath = path.resolve(startPath);
  
  while (true) {
    const packageJsonPath = path.join(currentPath, 'package.json');
    
    try {
      if (await fs.pathExists(packageJsonPath)) {
        return packageJsonPath;
      }
    } catch (error) {
      // Continue searching
    }
    
    const parentPath = path.dirname(currentPath);
    
    // Reached root without finding package.json
    if (parentPath === currentPath) {
      return null;
    }
    
    currentPath = parentPath;
  }
}

/**
 * Read and parse package.json safely
 * @param {string} packageJsonPath - Path to package.json
 * @returns {Object|null} Parsed package.json or null if error
 */
async function readPackageJson(packageJsonPath) {
  try {
    const content = await fs.readFile(packageJsonPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${packageJsonPath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get all installed dependencies from package.json
 * @param {Object} packageJson - Parsed package.json object
 * @returns {Set<string>} Set of installed package names
 */
function getInstalledDependencies(packageJson) {
  const dependencies = new Set();
  
  // Merge dependencies and devDependencies
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
    ...packageJson.optionalDependencies
  };
  
  Object.keys(deps).forEach(dep => dependencies.add(dep));
  
  return dependencies;
}

/**
 * Detect which package manager is being used
 * @param {string} projectPath - Path to the project root
 * @returns {string} 'npm', 'yarn', or 'pnpm'
 */
async function detectPackageManager(projectPath) {
  // Check for lock files
  if (await fs.pathExists(path.join(projectPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  
  if (await fs.pathExists(path.join(projectPath, 'yarn.lock'))) {
    return 'yarn';
  }
  
  // Default to npm
  return 'npm';
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

module.exports = {
  isBuiltinModule,
  isRelativeImport,
  extractPackageName,
  findPackageJson,
  readPackageJson,
  getInstalledDependencies,
  detectPackageManager,
  formatBytes,
  BUILTIN_MODULES
};
