module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'eqeqeq': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'space-infix-ops': 'error',
        'no-multi-spaces': 'error',
        'arrow-spacing': ['error', { 'before': true, 'after': true }],
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }]
    }
};