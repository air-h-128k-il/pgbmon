module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "@nuxtjs",
    "plugin:nuxt/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
    "no-unused-vars": ["error", { "args": "none" }],
    "func-call-spacing": ["error", "never"],
    "no-multi-spaces": 0,
    "no-var": 0,
    "nuxt/no-cjs-in-config": "off",
    "vue/singleline-html-element-content-newline": 0,
    "vue/max-attributes-per-line": 0,
    "object-shorthand": 0,
    "quote-props": ["error", "as-needed"]
  }
};