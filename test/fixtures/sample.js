import lodash from 'lodash';
import { map, filter } from 'lodash';
import axios from 'axios';
import chalk from 'chalk';

// This file uses several npm packages for testing
const _ = require('lodash');
const express = require('express');

// Built-in modules (should be ignored)
import fs from 'fs';
import path from 'path';

// Relative imports (should be ignored)
import utils from './utils';
import { helper } from '../helper';

// Dynamic import
const loadModule = async () => {
  const module = await import('ora');
  return module;
};

// Scoped packages
import parser from '@babel/parser';
const traverse = require('@babel/traverse');

export { something } from 'some-package';
