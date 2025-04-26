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

export const spyPlayerValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const financePlayerValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1),
        playerId: vine.number().positive(),
    })
);

export const financeWildTerritoryValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1),
    })
);
