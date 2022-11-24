module.exports = {
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    require('prettier-plugin-tailwindcss'),
  ],
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'ignore',
  insertPragma: false,
  jsxSingleQuote: false,
  jsxBracketSameLine: true,
  printWidth: 80,
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  requirePragma: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  // @trivago/prettier-plugin-sort-imports
  importOrder: [
    '(^react$|^react/(.*)$)',
    '(^next$|^next/(.*)$)',
    '<THIRD_PARTY_MODULES>',
    '^~/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  // tailwindcss
  tailwindConfig: './tailwind.config.js',
}
