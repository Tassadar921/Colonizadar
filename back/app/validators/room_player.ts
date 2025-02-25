import vine from '@vinejs/vine';

export const selectCountryParamValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const selectCountryValidator = vine.compile(
    vine.object({
        countryId: vine.number().positive(),
    })
);

export const selectBotDifficultyParamValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const selectBotDifficultyValidator = vine.compile(
    vine.object({
        difficultyId: vine.number().positive(),
    })
);

export const setReadyValidator = vine.compile(
    vine.object({
        isReady: vine.boolean(),
    })
);
