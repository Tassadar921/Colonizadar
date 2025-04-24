import vine from '@vinejs/vine';

export const gameMiddlewareValidator = vine.compile(
    vine.object({
        gameId: vine.number().positive(),
    })
);

export const isForeignTerritoryValidator = vine.compile(
    vine.object({
        territoryCode: vine.string().fixedLength(2).toUpperCase(),
    })
);
