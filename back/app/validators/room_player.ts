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
