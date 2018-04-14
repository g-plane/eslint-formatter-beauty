# eslint-formatter-beauty

Beautiful ESLint custom formatter.

![](screenshot.png)


![Travis](https://img.shields.io/travis/g-plane/eslint-formatter-beauty.svg?style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/g-plane/eslint-formatter-beauty.svg?style=flat-square)
![license](https://img.shields.io/github/license/g-plane/eslint-formatter-beauty.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/eslint-formatter-beauty.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/eslint-formatter-beauty.svg?style=flat-square)

## Installation

Using Yarn:

```
yarn add --dev eslint-formatter-beauty
```

Using npm:

```
npm install --save-dev eslint-formatter-beauty
```

## Usage

### ESLint CLI:

```
eslint -f=beauty path/to/your/file.js
```

### gulp-eslint

```js
const gulp = require('gulp')
const eslint = require('gulp-eslint')

gulp.task('lint', () =>
  gulp.src('file.js')
    .pipe(eslint())
    .pipe(eslint.format(require('eslint-formatter-beauty')))
)
```

### eslint-loader

```js
module.exports = {
  // ... other options
  module: {
    rules: [
      // ... other options
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-beauty')
        }
      }
    ]
  }
}
```

## License

Apache License 2.0

Copyright (c) 2018-present Pig Fang
