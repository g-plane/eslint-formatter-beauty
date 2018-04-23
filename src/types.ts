declare module 'code-excerpt' {
  function fn (
    source: string,
    line: number,
    options?: { around?: number }
  ): Array<{ line: number, value: string }>

  export = fn
}

declare module '@babel/highlight' {
  export default function (
    code: string,
    options?: { forceColor?: boolean }
  ): string
}
