import * as eslint from 'eslint'

declare function formatter (results: eslint.CLIEngine.LintResult[]): string

export = formatter
