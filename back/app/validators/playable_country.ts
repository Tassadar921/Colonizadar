import vine from '@vinejs/vine';

export const getAllPlayableCountriesValidator = vine.compile(
    vine.object({
        mapId: vine.number().positive(),
    })
);
