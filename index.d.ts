import * as eslint from 'eslint'

interface Options {
  noSummary?: boolean
}

declare function formatter (
  results: eslint.CLIEngine.LintResult[],
  options?: Options
): string

export = formatter
