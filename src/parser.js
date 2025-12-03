const fs = require('fs-extra');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const {
  isBuiltinModule,
  isRelativeImport,
  extractPackageName
} = require('./utils');

/**
 * Parse a single file and extract dependency imports
 * @param {string} filePath - Path to the file to parse
 * @returns {Promise<Array<string>>} Array of package names
 */
async function parseFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return parseCode(content, filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Parse code string and extract dependencies
 * @param {string} code - JavaScript/TypeScript code
 * @param {string} filePath - File path (for error messages)
 * @returns {Array<string>} Array of package names
 */
function parseCode(code, filePath = 'unknown') {
  const dependencies = new Set();

  try {
    // Parse the code into an AST
    const ast = parser.parse(code, {
      sourceType: 'unambiguous', // Auto-detect module vs script
      plugins: [
        'jsx',
        'typescript',
        'dynamicImport',
        'classProperties',
        'decorators-legacy',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator'
      ],
      errorRecovery: true // Try to continue parsing even with errors
    });

    // Traverse the AST and extract imports
    traverse(ast, {
      // Handle: import x from 'package'
      ImportDeclaration(path) {
        const source = path.node.source.value;
        addDependency(dependencies, source);
      },

      // Handle: const x = require('package')
      CallExpression(path) {
        const { callee, arguments: args } = path.node;

        // Check for require() calls
        if (
          callee.type === 'Identifier' &&
          callee.name === 'require' &&
          args.length > 0
        ) {
          // Only handle string literals (not dynamic requires)
          if (args[0].type === 'StringLiteral') {
            const source = args[0].value;
            addDependency(dependencies, source);
          }
        }

        // Handle dynamic imports: import('package')
        if (callee.type === 'Import' && args.length > 0) {
          if (args[0].type === 'StringLiteral') {
            const source = args[0].value;
            addDependency(dependencies, source);
          }
        }
      },

      // Handle: export { x } from 'package'
      ExportNamedDeclaration(path) {
        if (path.node.source) {
          const source = path.node.source.value;
          addDependency(dependencies, source);
        }
      },

      // Handle: export * from 'package'
      ExportAllDeclaration(path) {
        const source = path.node.source.value;
        addDependency(dependencies, source);
      }
    });

  } catch (error) {
    // If parsing fails, return empty array but log the error
    if (error.code === 'BABEL_PARSER_SYNTAX_ERROR') {
      console.warn(`Syntax error in ${filePath}: ${error.message}`);
    } else {
      console.warn(`Error parsing ${filePath}: ${error.message}`);
    }
    return [];
  }

  return Array.from(dependencies);
}

/**
 * Add a dependency to the set if it's valid
 * @param {Set<string>} dependencies - Set to add dependency to
 * @param {string} source - The import source string
 */
function addDependency(dependencies, source) {
  // Skip built-in modules
  if (isBuiltinModule(source)) {
    return;
  }

  // Skip relative imports (local files)
  if (isRelativeImport(source)) {
    return;
  }

  // Extract package name (handles scoped packages and subpaths)
  const packageName = extractPackageName(source);

  // Add to dependencies
  if (packageName) {
    dependencies.add(packageName);
  }
}

/**
 * Parse multiple files and aggregate dependencies
 * @param {Array<string>} filePaths - Array of file paths to parse
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Object>} Object mapping package names to file locations
 */
async function parseFiles(filePaths, onProgress = null) {
  const dependencyMap = {}; // { packageName: [file1, file2, ...] }
  
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    
    try {
      const dependencies = await parseFile(filePath);
      
      // Add each dependency to the map
      dependencies.forEach(dep => {
        if (!dependencyMap[dep]) {
          dependencyMap[dep] = [];
        }
        if (!dependencyMap[dep].includes(filePath)) {
          dependencyMap[dep].push(filePath);
        }
      });
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: filePaths.length,
          file: filePath
        });
      }
      
    } catch (error) {
      console.warn(`Failed to parse ${filePath}: ${error.message}`);
    }
  }

  return dependencyMap;
}

module.exports = {
  parseFile,
  parseCode,
  parseFiles
};
