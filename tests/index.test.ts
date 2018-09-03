import chalk from 'chalk'
import * as style from 'ansi-styles'
import * as logSymbols from 'log-symbols'
import formatter = require('../src')
// @ts-ignore
import fixture = require('./fixture.json')

test('no linting errors', () => {
  const successFixture = {
    filePath: '/Volumes/Programming/Node/eslint-formatter-beauty/ok.js',
    messages: [],
    errorCount: 0,
    warningCount: 0,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    source: 'console.log()'
  }
  const output = formatter([successFixture])
  expect(output).toBeEmpty()
})

test('file name', () => {
  const output = formatter(fixture)
  expect(output).toInclude('fixture.js')
})

test('linting messages', () => {
  const output = formatter(fixture)
  expect(output).toInclude(chalk.red(
    '  Error: Unexpected var, use let or const instead. '
  ))
  expect(output).toInclude(chalk.yellow(
    '  Warning: \'a\' is assigned a value but never used. '
  ))
})

test('rule id', () => {
  const output = formatter(fixture)
  expect(output).toInclude(chalk.gray('(no-var)'))
})

test('code highlight', () => {
  const output = formatter(fixture)
  expect(output).toInclude(style.bgRed.open + style.white.open)
  expect(output).toInclude('var a = 0;')
  expect(output).toInclude(style.bgRed.close + style.white.close)
  expect(output).toInclude(style.bgYellow.open + style.black.open)
  expect(output).toInclude(style.bgYellow.close + style.black.close)
})

test('line number', () => {
  const output = formatter(fixture)
  expect(output).toInclude(chalk.gray('   1 | '))
  expect(output).toInclude(chalk.gray('   2 | '))
  expect(output).toInclude(chalk.gray('   3 | '))
  expect(output).toInclude(chalk.gray('    9 | '))
  expect(output).toInclude(chalk.gray('   10 | '))
  expect(output).toInclude(chalk.gray('   11 | '))
})

test('summary', () => {
  const output = formatter(fixture)
  expect(output).toInclude(logSymbols.error + chalk.red('  3 errors'))
  expect(output).toInclude(logSymbols.warning + chalk.yellow('  1 warning'))
})

test('no summary', () => {
  const output = formatter(fixture, { noSummary: true })
  expect(output).not.toInclude(logSymbols.error + chalk.red('  3 errors'))
  expect(output).not.toInclude(logSymbols.warning + chalk.yellow('  1 warning'))
})
