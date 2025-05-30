import vine from '@vinejs/vine';

export const selectCountryParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const selectCountryValidator = vine.compile(
    vine.object({
        countryId: vine.number().positive(),
    })
);

export const selectBotDifficultyParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const selectBotDifficultyValidator = vine.compile(
    vine.object({
        difficultyId: vine.number().positive(),
    })
);

export const readyValidator = vine.compile(
    vine.object({
        isReady: vine.boolean(),
    })
);
