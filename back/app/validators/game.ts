import vine from '@vinejs/vine';

export const gameMiddlewareValidator = vine.compile(
    vine.object({
        gameId: vine.number().positive(),
    })
);

export const gameTerritoryMiddlewareValidator = vine.compile(
    vine.object({
        territoryCode: vine.string().fixedLength(2).toUpperCase(),
    })
);

export const spyPlayerParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const financePlayerParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const financePlayerValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1),
    })
);

export const financeWildTerritoryValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1),
    })
);

export const buyInfantryValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1),
    })
);
