const {
  isBuiltinModule,
  isRelativeImport,
  extractPackageName
} = require('../src/utils');

describe('Utils', () => {
  describe('isBuiltinModule', () => {
    test('should detect Node.js built-in modules', () => {
      expect(isBuiltinModule('fs')).toBe(true);
      expect(isBuiltinModule('path')).toBe(true);
      expect(isBuiltinModule('http')).toBe(true);
      expect(isBuiltinModule('crypto')).toBe(true);
    });

    test('should detect node: protocol', () => {
      expect(isBuiltinModule('node:fs')).toBe(true);
      expect(isBuiltinModule('node:path')).toBe(true);
    });

    test('should return false for npm packages', () => {
      expect(isBuiltinModule('lodash')).toBe(false);
      expect(isBuiltinModule('express')).toBe(false);
      expect(isBuiltinModule('@babel/parser')).toBe(false);
    });
  });

  describe('isRelativeImport', () => {
    test('should detect relative imports', () => {
      expect(isRelativeImport('./utils')).toBe(true);
      expect(isRelativeImport('../config')).toBe(true);
      expect(isRelativeImport('./src/utils')).toBe(true);
      expect(isRelativeImport('../lib/helper')).toBe(true);
    });

    test('should detect absolute paths', () => {
      expect(isRelativeImport('/usr/local/lib')).toBe(true);
      expect(isRelativeImport('\\Windows\\System32')).toBe(true);
    });

    test('should return false for npm packages', () => {
      expect(isRelativeImport('lodash')).toBe(false);
      expect(isRelativeImport('express')).toBe(false);
      expect(isRelativeImport('@babel/parser')).toBe(false);
    });
  });

  describe('extractPackageName', () => {
    test('should extract simple package names', () => {
      expect(extractPackageName('lodash')).toBe('lodash');
      expect(extractPackageName('express')).toBe('express');
      expect(extractPackageName('axios')).toBe('axios');
    });

    test('should extract scoped package names', () => {
      expect(extractPackageName('@babel/parser')).toBe('@babel/parser');
      expect(extractPackageName('@babel/traverse')).toBe('@babel/traverse');
      expect(extractPackageName('@types/node')).toBe('@types/node');
    });

    test('should extract package names from subpaths', () => {
      expect(extractPackageName('lodash/map')).toBe('lodash');
      expect(extractPackageName('lodash/fp/map')).toBe('lodash');
      expect(extractPackageName('@babel/parser/lib/index')).toBe('@babel/parser');
    });

    test('should handle edge cases', () => {
      expect(extractPackageName('@babel')).toBe('@babel');
      expect(extractPackageName('package-with-dashes')).toBe('package-with-dashes');
    });
  });
});
