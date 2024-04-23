module.exports = {
  trailingComma: "es5",
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],

  // tailwind config
  tailwindFunctions: ["clsx", "cn"],

  // imports config
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@/app/(.*)$",
    "^@/lib/(.*)$",
    "^@/components/(.*)$",
    "^[./]"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
