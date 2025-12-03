const { parseCode } = require('../src/parser');

describe('Parser', () => {
  describe('parseCode', () => {
    test('should parse ES6 import statements', () => {
      const code = `
        import lodash from 'lodash';
        import { map } from 'lodash';
        import * as _ from 'lodash';
      `;
      const deps = parseCode(code);
      expect(deps).toContain('lodash');
    });

    test('should parse CommonJS require statements', () => {
      const code = `
        const lodash = require('lodash');
        const { map } = require('lodash/map');
      `;
      const deps = parseCode(code);
      expect(deps).toContain('lodash');
    });

    test('should parse dynamic imports', () => {
      const code = `
        const lodash = await import('lodash');
        import('axios').then(module => {});
      `;
      const deps = parseCode(code);
      expect(deps).toContain('lodash');
      expect(deps).toContain('axios');
    });

    test('should parse export statements', () => {
      const code = `
        export { map } from 'lodash';
        export * from 'axios';
      `;
      const deps = parseCode(code);
      expect(deps).toContain('lodash');
      expect(deps).toContain('axios');
    });

    test('should handle scoped packages', () => {
      const code = `
        import parser from '@babel/parser';
        const traverse = require('@babel/traverse');
      `;
      const deps = parseCode(code);
      expect(deps).toContain('@babel/parser');
      expect(deps).toContain('@babel/traverse');
    });

    test('should ignore built-in modules', () => {
      const code = `
        import fs from 'fs';
        import path from 'path';
        const http = require('http');
        import crypto from 'node:crypto';
      `;
      const deps = parseCode(code);
      expect(deps).not.toContain('fs');
      expect(deps).not.toContain('path');
      expect(deps).not.toContain('http');
      expect(deps).not.toContain('crypto');
      expect(deps).not.toContain('node:crypto');
    });

    test('should ignore relative imports', () => {
      const code = `
        import utils from './utils';
        import config from '../config';
        const helper = require('./helper');
      `;
      const deps = parseCode(code);
      expect(deps).toHaveLength(0);
    });

    test('should handle TypeScript syntax', () => {
      const code = `
        import type { User } from 'types';
        import lodash from 'lodash';
        interface Props {
          name: string;
        }
      `;
      const deps = parseCode(code);
      expect(deps).toContain('lodash');
    });

    test('should handle JSX syntax', () => {
      const code = `
        import React from 'react';
        import { useState } from 'react';
        
        function App() {
          return <div>Hello</div>;
        }
      `;
      const deps = parseCode(code);
      expect(deps).toContain('react');
    });

    test('should handle syntax errors gracefully', () => {
      const code = `
        import lodash from 'lodash'
        this is invalid syntax!!!
      `;
      const deps = parseCode(code);
      // Should return empty array on error, not throw
      expect(Array.isArray(deps)).toBe(true);
    });

    test('should deduplicate dependencies', () => {
      const code = `
        import lodash from 'lodash';
        import { map } from 'lodash';
        const _ = require('lodash');
      `;
      const deps = parseCode(code);
      expect(deps.filter(d => d === 'lodash')).toHaveLength(1);
    });

    test('should extract package name from subpaths', () => {
      const code = `
        import map from 'lodash/map';
        const debounce = require('lodash/debounce');
      `;
      const deps = parseCode(code);
      expect(deps).toContain('lodash');
      expect(deps).toHaveLength(1);
    });
  });
});
