const { scanFiles, getFileStats } = require('./scanner');
const { parseFiles } = require('./parser');
const { analyzeDependencies, formatAnalysisResults, findUnusedDependencies } = require('./analyzer');
const { installDependencies, checkInstallCapability } = require('./installer');

/**
 * Main function to scan project and find missing dependencies
 * @param {string} projectPath - Path to the project root
 * @param {Object} options - Scan options
 * @returns {Promise<Object>} Analysis results
 */
async function scan(projectPath, options = {}) {
  const {
    ignorePatterns = [],
    respectGitignore = true,
    verbose = false,
    onProgress = null
  } = options;

  // Step 1: Scan for files
  if (onProgress) onProgress({ step: 'scanning', message: 'Scanning files...' });
  const files = await scanFiles(projectPath, { ignorePatterns, respectGitignore });
  
  if (files.length === 0) {
    throw new Error('No JavaScript/TypeScript files found in the project.');
  }

  // Step 2: Parse files and extract dependencies
  if (onProgress) onProgress({ step: 'parsing', message: 'Parsing dependencies...' });
  const dependencyMap = await parseFiles(files, onProgress);

  // Step 3: Analyze dependencies
  if (onProgress) onProgress({ step: 'analyzing', message: 'Analyzing dependencies...' });
  const analysis = await analyzeDependencies(dependencyMap, projectPath);

  // Step 4: Format results
  const results = formatAnalysisResults(analysis, { verbose });

  return {
    ...results,
    analysis, // Include full analysis for further processing
    files
  };
}

/**
 * Scan and install missing dependencies
 * @param {string} projectPath - Path to the project root
 * @param {Object} options - Installation options
 * @returns {Promise<Object>} Installation results
 */
async function fix(projectPath, options = {}) {
  const {
    saveDev = false,
    dryRun = false,
    onProgress = null,
    onOutput = null
  } = options;

  // First, scan for missing dependencies
  const scanResults = await scan(projectPath, { onProgress });

  if (scanResults.missing.length === 0) {
    return {
      success: true,
      message: 'No missing dependencies found!',
      scan: scanResults
    };
  }

  // Extract package names
  const packagesToInstall = scanResults.missing.map(item => item.package);

  // Check if we can install
  if (onProgress) onProgress({ step: 'checking', message: 'Checking package manager...' });
  const capability = await checkInstallCapability(projectPath);
  
  if (!capability.available) {
    throw new Error(`Package manager ${capability.packageManager} not available. Please install it first.`);
  }

  // Install packages
  if (onProgress) onProgress({ step: 'installing', message: 'Installing packages...' });
  const installResult = await installDependencies(packagesToInstall, projectPath, {
    saveDev,
    dryRun,
    onOutput
  });

  return {
    ...installResult,
    scan: scanResults,
    packagesInstalled: packagesToInstall
  };
}

/**
 * Find unused dependencies in the project
 * @param {string} projectPath - Path to the project root
 * @param {Object} options - Scan options
 * @returns {Promise<Object>} Unused dependencies results
 */
async function findUnused(projectPath, options = {}) {
  const scanResults = await scan(projectPath, options);
  const unused = findUnusedDependencies(scanResults.analysis);

  return {
    unused,
    total: unused.length,
    scan: scanResults
  };
}

module.exports = {
  scan,
  fix,
  findUnused,
  // Export individual modules for advanced usage
  scanner: require('./scanner'),
  parser: require('./parser'),
  analyzer: require('./analyzer'),
  installer: require('./installer'),
  utils: require('./utils')
};
