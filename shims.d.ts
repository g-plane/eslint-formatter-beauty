import * as eslint from 'eslint'
import 'jest-extended'

declare module '*.json' {
  var result: eslint.CLIEngine.LintResult[]
  export = result
}
