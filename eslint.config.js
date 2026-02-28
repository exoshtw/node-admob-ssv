const { defineConfig } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const jest = require("eslint-plugin-jest");
const jsdoc = require("eslint-plugin-jsdoc");
const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,

        globals: {
            ...globals.node,
            ...jest.environments.globals.globals,
        },

        ecmaVersion: 2020,
        sourceType: "module",
        parserOptions: {},
    },

    plugins: {
        jest,
        jsdoc,
    },

    extends: compat.extends("plugin:@typescript-eslint/recommended", "plugin:jsdoc/recommended"),

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,

            FunctionExpression: {
                parameters: "first",
            },
        }],

        "@typescript-eslint/no-explicit-any": ["warn"],

        "jsdoc/tag-lines": 0,
        "padded-blocks": 0,
        "no-constant-condition": 0,
    },
}]);
