/* eslint-disable prefer-template */

const assert = require('assert')
const chalk = require('chalk')['default']
const style = require('ansi-styles')
const logSymbols = require('log-symbols')
const m = require('.')
const fixture = require('./fixture.json')

const output = m(fixture)

// File name
assert(output.includes('fixture.js'))

// Linter message
assert(output.includes(chalk.red(
  '  Error: Unexpected var, use let or const instead. '
)))
assert(output.includes(chalk.yellow(
  '  Warning: \'a\' is assigned a value but never used. '
)))

// Rule Id
assert(output.includes(chalk.gray('(no-var)')))

// Code highlight
assert(output.includes(style.bgRed.open + style.white.open))
assert(output.includes('var a = 0;'))
assert(output.includes(style.bgRed.close + style.white.close))
assert(output.includes(style.bgYellow.open + style.black.open))
assert(output.includes(style.bgYellow.close + style.black.close))

// Line number
assert(output.includes(chalk.gray('   1 | ')))
assert(output.includes(chalk.gray('   2 | ')))
assert(output.includes(chalk.gray('   3 | ')))
assert(output.includes(chalk.gray('    9 | ')))
assert(output.includes(chalk.gray('   10 | ')))
assert(output.includes(chalk.gray('   11 | ')))

// Summary
assert(output.includes(logSymbols.error + chalk.red('  3 errors')))
assert(output.includes(logSymbols.warning + chalk.yellow('  1 warning')))

console.log(chalk.green('All tests passed.'))
