const codeExcerpt = require('code-excerpt')
const style = require('ansi-styles')
const chalk = require('chalk')['default']
const logSymbols = require('log-symbols')

function padStart (text, length) {
  return text.length >= length
    ? text
    : `${' '.repeat(length - text.length)}${text}`
}

module.exports = results => {
  results.forEach(result => {
    if (result.messages.length === 0) {
      return
    }

    function getLines (lineNum) {
      return codeExcerpt(result.source, lineNum, { around: 2 })
    }

    process.stdout.write('\n')
    process.stdout.write(chalk.underline(
      result.filePath.replace(process.cwd(), '.')
    ))
    process.stdout.write('\n')

    result.messages.forEach(message => {
      process.stdout.write(
        message.severity === 2
          ? chalk.red(`  Error: ${message.message} `)
          : chalk.yellow(`  Warning: ${message.message} `)
      )
      process.stdout.write(chalk.gray(`(${message.ruleId})\n`))

      const rawLines = getLines(message.line)
      const padding = rawLines[rawLines.length - 1].line.toString().length + 6
      const lines = rawLines.map(line => {
        let painted = chalk.gray(padStart(
          `${line.line} | `,
          padding
        ))

        const painter = text => (message.severity === 2
          ? chalk.bgRed(chalk.white(text))
          : chalk.bgYellow(chalk.black(text)))
        painter.open = message.severity === 2
          ? style.bgRed.open + style.white.open
          : style.bgYellow.open + style.black.open
        painter.close = message.severity === 2
          ? style.bgRed.close + style.white.close
          : style.bgYellow.close + style.black.close

        if (line.line === message.line) {
          const start = message.column
          const end = message.endColumn || start

          const chars = line.value.split('')
          chars.splice(start - 1, 0, painter.open)
          if (message.line === message.endLine || !message.endLine) {
            chars.splice(start === end ? end + 1 : end, 0, painter.close)
          } else {
            chars.push(painter.close)
          }

          painted += chars.join('')
        } else if (message.endLine
          && line.line > message.line
          && line.line < message.endLine) {
          painted += painter(line.value)
        } else if (message.endLine && line.line === message.endLine) {
          const chars = line.value.split('')
          chars.unshift(painter.open)
          chars.splice(message.endColumn, 0, painter.close)

          painted += chars.join('')
        } else {
          painted += line.value
        }

        return painted
      })

      process.stdout.write(lines.join('\n'))

      process.stdout.write('\n\n')
    })
  })

  const errorsCount = results
    .map(result => result.errorCount)
    .reduce((acc, cur) => acc + cur, 0)
  const warningsCount = results
    .map(result => result.warningCount)
    .reduce((acc, cur) => acc + cur, 0)
  if (errorsCount > 0) {
    console.log(
      logSymbols.error,
      chalk.red(
        ` ${errorsCount} error${errorsCount === 1 ? '' : 's'}`
      )
    )
  }
  if (warningsCount > 0) {
    console.log(
      logSymbols.warning,
      chalk.yellow(
        ` ${warningsCount} warning${warningsCount === 1 ? '' : 's'}`
      )
    )
  }
  if (errorsCount === 0 && warningsCount === 0) {
    console.log(
      '\n',
      logSymbols.success,
      chalk.green(' Congrats! Your code looks well.')
    )
  }

  process.stdout.write('\n')
}
