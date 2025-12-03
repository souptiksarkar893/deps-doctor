const { spawn } = require('child_process');
const path = require('path');
const { detectPackageManager } = require('./utils');

/**
 * Install missing dependencies
 * @param {Array<string>} packages - Array of package names to install
 * @param {string} projectPath - Path to the project root
 * @param {Object} options - Installation options
 * @returns {Promise<Object>} Installation results
 */
async function installDependencies(packages, projectPath, options = {}) {
  const {
    saveDev = false,
    dryRun = false,
    onOutput = null,
    onError = null
  } = options;

  if (packages.length === 0) {
    return {
      success: true,
      installed: [],
      message: 'No packages to install'
    };
  }

  if (dryRun) {
    return {
      success: true,
      installed: [],
      dryRun: true,
      message: `Would install: ${packages.join(', ')}`
    };
  }

  const packageManager = await detectPackageManager(projectPath);
  const command = buildInstallCommand(packageManager, packages, saveDev);

  try {
    await executeCommand(command, projectPath, onOutput, onError);
    
    return {
      success: true,
      installed: packages,
      packageManager,
      message: `Successfully installed ${packages.length} package(s)`
    };
  } catch (error) {
    return {
      success: false,
      installed: [],
      packageManager,
      error: error.message,
      message: `Failed to install packages: ${error.message}`
    };
  }
}

/**
 * Build the install command based on package manager
 * @param {string} packageManager - 'npm', 'yarn', or 'pnpm'
 * @param {Array<string>} packages - Packages to install
 * @param {boolean} saveDev - Whether to save as devDependencies
 * @returns {Object} Command object with cmd and args
 */
function buildInstallCommand(packageManager, packages, saveDev) {
  const commands = {
    npm: {
      cmd: 'npm',
      args: ['install', saveDev ? '--save-dev' : '--save', ...packages]
    },
    yarn: {
      cmd: 'yarn',
      args: ['add', saveDev ? '--dev' : '', ...packages].filter(Boolean)
    },
    pnpm: {
      cmd: 'pnpm',
      args: ['add', saveDev ? '--save-dev' : '', ...packages].filter(Boolean)
    }
  };

  return commands[packageManager] || commands.npm;
}

/**
 * Execute a shell command
 * @param {Object} command - Command object with cmd and args
 * @param {string} cwd - Working directory
 * @param {Function} onOutput - Callback for stdout
 * @param {Function} onError - Callback for stderr
 * @returns {Promise<void>}
 */
function executeCommand(command, cwd, onOutput, onError) {
  return new Promise((resolve, reject) => {
    const { cmd, args } = command;
    
    const proc = spawn(cmd, args, {
      cwd,
      shell: true,
      stdio: onOutput || onError ? 'pipe' : 'inherit'
    });

    let stdout = '';
    let stderr = '';

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        if (onOutput) {
          onOutput(output);
        }
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        if (onError) {
          onError(output);
        }
      });
    }

    proc.on('error', (error) => {
      reject(new Error(`Failed to execute ${cmd}: ${error.message}`));
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${cmd} exited with code ${code}\n${stderr}`));
      }
    });
  });
}

/**
 * Check if packages can be installed (package manager is available)
 * @param {string} projectPath - Path to the project root
 * @returns {Promise<Object>} Check results
 */
async function checkInstallCapability(projectPath) {
  const packageManager = await detectPackageManager(projectPath);
  
  return new Promise((resolve) => {
    const proc = spawn(packageManager, ['--version'], {
      shell: true,
      stdio: 'pipe'
    });

    let version = '';
    
    proc.stdout.on('data', (data) => {
      version += data.toString().trim();
    });

    proc.on('close', (code) => {
      resolve({
        available: code === 0,
        packageManager,
        version: version || 'unknown'
      });
    });

    proc.on('error', () => {
      resolve({
        available: false,
        packageManager,
        error: `${packageManager} not found`
      });
    });
  });
}

/**
 * Install a single package
 * @param {string} packageName - Package name to install
 * @param {string} projectPath - Project root path
 * @param {Object} options - Installation options
 * @returns {Promise<Object>} Installation result
 */
async function installPackage(packageName, projectPath, options = {}) {
  return installDependencies([packageName], projectPath, options);
}

module.exports = {
  installDependencies,
  installPackage,
  checkInstallCapability,
  buildInstallCommand,
  executeCommand
};
