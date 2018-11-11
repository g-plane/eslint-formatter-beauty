import * as eslint from 'eslint'

declare module '*.json' {
  var result: eslint.CLIEngine.LintResult[]
  export = result
}
