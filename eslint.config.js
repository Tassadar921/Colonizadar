import { configApp } from '@adonisjs/eslint-config'

export default {
    ...configApp(),
    rules: {
        ...configApp().rules,
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['error', { code: 100 }],
    },
    overrides: [
        {
            files: ['app/models/**/*.ts'],
            rules: {
                semi: ['error', 'always'],
            },
        },
    ],
}
