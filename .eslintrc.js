module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        "jest",
        "jsdoc",
    ],
    env: {
        node: true,
        "jest/globals": true,
        "es6": true
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:jsdoc/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
            FunctionExpression: {
                parameters: "first",
            },
        }],
        "jsdoc/tag-lines": 0,
        "padded-blocks": 0,
        "no-constant-condition": 0,
    }
};
