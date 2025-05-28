import vine from '@vinejs/vine';

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().trim(),
    })
);

export const sendAccountCreationEmailValidator = vine.compile(
    vine.object({
        username: vine.string().trim().minLength(3).maxLength(50).alphaNumeric(),
        email: vine.string().trim().email(),
        password: vine
            .string()
            .trim()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
            .trim()
            .confirmed({ confirmationField: 'confirmPassword' }),
        consent: vine.boolean(),
    })
);

export const confirmAccountCreationValidator = vine.compile(
    vine.object({
        token: vine.string().trim().uuid(),
    })
);
