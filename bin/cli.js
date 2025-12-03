#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const { scan, fix, findUnused } = require('../src/index');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('dep-doctor')
  .description('Automatically detect and fix missing Node.js dependencies')
  .version(packageJson.version);

/**
 * Scan command - Just report missing dependencies
 */
program
  .command('scan')
  .description('Scan project and report missing dependencies')
  .option('-p, --path <path>', 'Project path to scan', process.cwd())
  .option('-v, --verbose', 'Show detailed output including file locations')
  .option('--ignore <patterns...>', 'Additional patterns to ignore')
  .option('--no-gitignore', 'Do not respect .gitignore')
  .action(async (options) => {
    const spinner = ora('Scanning project...').start();
    
    try {
      const projectPath = path.resolve(options.path);
      
      const results = await scan(projectPath, {
        ignorePatterns: options.ignore || [],
        respectGitignore: options.gitignore,
        verbose: options.verbose,
        onProgress: (progress) => {
          if (progress.step === 'scanning') {
            spinner.text = 'Scanning files...';
          } else if (progress.step === 'parsing') {
            spinner.text = 'Parsing dependencies...';
          } else if (progress.step === 'analyzing') {
            spinner.text = 'Analyzing dependencies...';
          }
        }
      });

      spinner.succeed('Scan complete!');
      console.log();

      // Display summary
      console.log(chalk.bold.blue('📊 Summary:'));
      console.log(`  Files scanned: ${chalk.cyan(results.summary.filesScanned)}`);
      console.log(`  Dependencies found: ${chalk.cyan(results.summary.dependenciesFound)}`);
      console.log(`  Dependencies installed: ${chalk.green(results.summary.dependenciesInstalled)}`);
      console.log(`  Dependencies missing: ${chalk.red(results.summary.dependenciesMissing)}`);
      console.log();

      if (results.missing.length === 0) {
        console.log(chalk.green.bold('✅ All dependencies are installed!'));
      } else {
        console.log(chalk.red.bold(`❌ ${results.missing.length} missing dependencies found:`));
        console.log();

        results.missing.forEach((item, index) => {
          console.log(`  ${index + 1}. ${chalk.yellow(item.package)}`);
          console.log(`     Used in ${chalk.cyan(item.usedInFiles)} file(s)`);
          
          if (options.verbose && item.locations) {
            item.locations.slice(0, 5).forEach(loc => {
              console.log(`       ${chalk.gray('→')} ${loc}`);
            });
            if (item.locations.length > 5) {
              console.log(`       ${chalk.gray(`... and ${item.locations.length - 5} more`)}`);
            }
          }
          console.log();
        });

        console.log(chalk.blue('💡 To install missing dependencies, run:'));
        console.log(chalk.cyan(`   dep-doctor install`));
        console.log();
      }

    } catch (error) {
      spinner.fail('Scan failed');
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Install command - Scan and install missing dependencies
 */
program
  .command('install')
  .alias('fix')
  .description('Scan and automatically install missing dependencies')
  .option('-p, --path <path>', 'Project path to scan', process.cwd())
  .option('-D, --save-dev', 'Install as devDependencies')
  .option('--dry-run', 'Show what would be installed without installing')
  .option('--ignore <patterns...>', 'Additional patterns to ignore')
  .option('--no-gitignore', 'Do not respect .gitignore')
  .action(async (options) => {
    const spinner = ora('Scanning project...').start();
    
    try {
      const projectPath = path.resolve(options.path);
      
      const results = await fix(projectPath, {
        saveDev: options.saveDev,
        dryRun: options.dryRun,
        onProgress: (progress) => {
          if (progress.step === 'scanning') {
            spinner.text = 'Scanning files...';
          } else if (progress.step === 'parsing') {
            spinner.text = 'Parsing dependencies...';
          } else if (progress.step === 'analyzing') {
            spinner.text = 'Analyzing dependencies...';
          } else if (progress.step === 'checking') {
            spinner.text = 'Checking package manager...';
          } else if (progress.step === 'installing') {
            spinner.text = 'Installing packages...';
          }
        },
        onOutput: (output) => {
          // Show installation output in real-time
          spinner.stop();
          process.stdout.write(output);
          spinner.start();
        }
      });

      if (results.scan.missing.length === 0) {
        spinner.succeed('No missing dependencies found!');
        console.log(chalk.green('\n✅ All dependencies are already installed!'));
        return;
      }

      if (options.dryRun) {
        spinner.info('Dry run - no packages installed');
        console.log(chalk.yellow('\n🔍 Dry Run Mode - Would install:'));
        results.packagesInstalled.forEach(pkg => {
          console.log(`  ${chalk.cyan('→')} ${pkg}`);
        });
        return;
      }

      if (results.success) {
        spinner.succeed('Installation complete!');
        console.log(chalk.green(`\n✅ Successfully installed ${results.packagesInstalled.length} package(s):`));
        results.packagesInstalled.forEach(pkg => {
          console.log(`  ${chalk.green('✓')} ${pkg}`);
        });
        console.log(chalk.gray(`\nUsing: ${results.packageManager}`));
      } else {
        spinner.fail('Installation failed');
        console.error(chalk.red(`\n❌ Error: ${results.error}`));
        process.exit(1);
      }

    } catch (error) {
      spinner.fail('Operation failed');
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Unused command - Find unused dependencies
 */
program
  .command('unused')
  .description('Find dependencies that are installed but not used')
  .option('-p, --path <path>', 'Project path to scan', process.cwd())
  .action(async (options) => {
    const spinner = ora('Scanning project...').start();
    
    try {
      const projectPath = path.resolve(options.path);
      
      const results = await findUnused(projectPath, {
        onProgress: (progress) => {
          if (progress.step === 'scanning') {
            spinner.text = 'Scanning files...';
          } else if (progress.step === 'parsing') {
            spinner.text = 'Parsing dependencies...';
          } else if (progress.step === 'analyzing') {
            spinner.text = 'Finding unused dependencies...';
          }
        }
      });

      spinner.succeed('Scan complete!');
      console.log();

      if (results.unused.length === 0) {
        console.log(chalk.green('✅ No unused dependencies found!'));
        console.log(chalk.gray('All installed packages are being used.'));
      } else {
        console.log(chalk.yellow.bold(`⚠️  ${results.unused.length} unused dependencies found:`));
        console.log();
        
        results.unused.forEach((pkg, index) => {
          console.log(`  ${index + 1}. ${chalk.yellow(pkg)}`);
        });
        
        console.log();
        console.log(chalk.blue('💡 You can remove them with:'));
        console.log(chalk.cyan(`   npm uninstall ${results.unused.join(' ')}`));
      }

    } catch (error) {
      spinner.fail('Scan failed');
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
