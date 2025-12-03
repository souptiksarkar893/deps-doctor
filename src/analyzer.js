const path = require('path');
const {
  findPackageJson,
  readPackageJson,
  getInstalledDependencies
} = require('./utils');

/**
 * Analyze dependencies and find missing packages
 * @param {Object} dependencyMap - Map of found dependencies to file locations
 * @param {string} projectPath - Path to the project root
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeDependencies(dependencyMap, projectPath) {
  // Find and read package.json
  const packageJsonPath = await findPackageJson(projectPath);
  
  if (!packageJsonPath) {
    throw new Error('No package.json found in the project. Please run "npm init" first.');
  }

  const packageJson = await readPackageJson(packageJsonPath);
  const installedDeps = getInstalledDependencies(packageJson);

  // Find missing dependencies
  const foundDeps = Object.keys(dependencyMap);
  const missingDeps = {};
  const installedButFound = [];
  
  foundDeps.forEach(dep => {
    if (!installedDeps.has(dep)) {
      missingDeps[dep] = dependencyMap[dep];
    } else {
      installedButFound.push(dep);
    }
  });

  // Calculate statistics
  const stats = {
    totalFilesScanned: new Set(
      Object.values(dependencyMap).flat()
    ).size,
    totalDependenciesFound: foundDeps.length,
    totalDependenciesInstalled: installedDeps.size,
    totalMissing: Object.keys(missingDeps).length,
    totalUsedAndInstalled: installedButFound.length
  };

  return {
    packageJsonPath,
    packageJson,
    installedDeps: Array.from(installedDeps),
    foundDeps,
    missingDeps,
    installedButFound,
    stats
  };
}

/**
 * Format analysis results for display
 * @param {Object} analysis - Analysis results
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted results
 */
function formatAnalysisResults(analysis, options = {}) {
  const { verbose = false } = options;
  const { missingDeps, stats, packageJsonPath } = analysis;

  const result = {
    summary: {
      packageJson: packageJsonPath,
      filesScanned: stats.totalFilesScanned,
      dependenciesFound: stats.totalDependenciesFound,
      dependenciesMissing: stats.totalMissing,
      dependenciesInstalled: stats.totalUsedAndInstalled
    },
    missing: []
  };

  // Format missing dependencies
  Object.entries(missingDeps).forEach(([packageName, locations]) => {
    const item = {
      package: packageName,
      usedInFiles: locations.length
    };

    if (verbose) {
      item.locations = locations.map(loc => 
        path.relative(path.dirname(packageJsonPath), loc)
      );
    }

    result.missing.push(item);
  });

  // Sort by usage count (descending)
  result.missing.sort((a, b) => b.usedInFiles - a.usedInFiles);

  return result;
}

/**
 * Generate a report object for missing dependencies
 * @param {Object} analysis - Analysis results
 * @returns {Object} Report object
 */
function generateReport(analysis) {
  const { missingDeps, stats, packageJson } = analysis;

  const report = {
    timestamp: new Date().toISOString(),
    project: {
      name: packageJson.name || 'unknown',
      version: packageJson.version || 'unknown'
    },
    statistics: stats,
    missingDependencies: []
  };

  Object.entries(missingDeps).forEach(([packageName, locations]) => {
    report.missingDependencies.push({
      name: packageName,
      usageCount: locations.length,
      files: locations
    });
  });

  return report;
}

/**
 * Find unused dependencies (installed but not imported anywhere)
 * @param {Object} analysis - Analysis results
 * @returns {Array<string>} Array of unused package names
 */
function findUnusedDependencies(analysis) {
  const { installedDeps, foundDeps } = analysis;
  const foundSet = new Set(foundDeps);
  
  return installedDeps.filter(dep => !foundSet.has(dep));
}

module.exports = {
  analyzeDependencies,
  formatAnalysisResults,
  generateReport,
  findUnusedDependencies
};
