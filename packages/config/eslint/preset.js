module.exports = {
  extends: [
    'turbo',
    'prettier',
    'eslint:recommended'
  ],
  env: {
  },
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  rules: {
    'semi': ['error', 'never'],
    'camelcase': 'error',  // 强制使用骆驼拼写法命名约定
    'no-mixed-spaces-and-tabs': 'error', //禁止混用tab和空格
    'indent': ['warn', 2], //缩进风格这里不做硬性规定，但是产品组内要达成统一
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
}
