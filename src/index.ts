import * as eslint from 'eslint'
import * as style from 'ansi-styles'
import chalk from 'chalk'
import codeExcerpt = require('code-excerpt')
import * as logSymbols from 'log-symbols'
import highlight from '@babel/highlight'

function padStart(text: string, length: number): string {
  return text.length >= length
    ? text
    : `${' '.repeat(length - text.length)}${text}`
}

function format(
  results: eslint.CLIEngine.LintResult[],
  options?: { noSummary?: boolean }
) {
  let output = '\n'

  results.forEach(result => {
    if (result.messages.length === 0) {
      return
    }

    function getLines(lineNum: number) {
      const source = result.output || result.source || ''
      return codeExcerpt(source, lineNum, { around: 2 })
    }

    output += chalk.underline(result.filePath.replace(process.cwd(), '.'))
    output += '\n'

    result
      .messages
      .sort((a, b) => b.severity - a.severity)
      .forEach(message => {
        output += message.severity === 2
          ? chalk.red(`  Error: ${message.message} `)
          : chalk.yellow(`  Warning: ${message.message} `)
        output += chalk.gray(`(${message.ruleId})`)
        output += '\n'

        const rawLines = getLines(message.line)
        const padding = rawLines[rawLines.length - 1].line.toString().length + 6
        const lines = rawLines.map(line => {
          let painted = chalk.gray(padStart(
            `${line.line} | `,
            padding
          ))

          const painter = (text: string) => (message.severity === 2
            ? chalk.bgRed(chalk.white(text))
            : chalk.bgYellow(chalk.black(text)))
          const painterSign = {
            open: `/*****${message.severity === 2
              ? style.bgRed.open + style.white.open
              : style.bgYellow.open + style.black.open}`,
            close: `${message.severity === 2
              ? style.bgRed.close + style.white.close
              : style.bgYellow.close + style.black.close}*****/`
          }

          if (line.line === message.line) {
            const start = message.column
            const end = message.endColumn || start

            const chars = line.value.split('')
            chars.splice(start - 1, 0, painterSign.open)
            if (message.line === message.endLine || !message.endLine) {
              chars.splice(start === end ? end + 1 : end, 0, painterSign.close)
            } else {
              chars.push(painterSign.close)
            }

            painted += highlight(chars.join(''))
          } else if (message.endLine
          && line.line > message.line
          && line.line < message.endLine) {
            painted += highlight(`/*****${painter(line.value)}*****/`)
          } else if (message.endLine && line.line === message.endLine) {
            const chars = line.value.split('')
            chars.unshift(painterSign.open)
            chars.splice(message.endColumn!, 0, painterSign.close)

            painted += highlight(chars.join(''))
          } else {
            painted += highlight(line.value)
          }

          painted = painted.replace(/\/\*\*\*\*\*/g, '')
            .replace(/\*\*\*\*\*\//g, '')

          return painted
        })

        output += lines.join('\n')

        output += '\n\n'
      })
  })

  const errorsCount = results
    .map(result => result.errorCount)
    .reduce((acc, cur) => acc + cur, 0)
  const warningsCount = results
    .map(result => result.warningCount)
    .reduce((acc, cur) => acc + cur, 0)

  if (errorsCount === 0 && warningsCount === 0) {
    return ''   // Without errors and warnings, be silent
  }

  if (options && options.noSummary) {
    return output
  }

  if (errorsCount > 0) {
    output += logSymbols.error
      + chalk.red(`  ${errorsCount} error${errorsCount === 1 ? '' : 's'}`)
  }
  if (warningsCount > 0) {
    if (errorsCount > 0) {
      output += '\n'
    }

    output += logSymbols.warning
      + chalk.yellow(
        `  ${warningsCount} warning${warningsCount === 1 ? '' : 's'}`
      )
  }

  output += '\n'

  return output
}

export = format
