import vine from '@vinejs/vine';

export const selectCountryValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
        countryId: vine.number().positive(),
    })
);

export const selectBotDifficultyValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
        difficultyId: vine.number().positive(),
    })
);

export const setReadyValidator = vine.compile(
    vine.object({
        isReady: vine.boolean(),
    })
);
