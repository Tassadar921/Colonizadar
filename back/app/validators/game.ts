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
        amount: vine.number().min(1000),
    })
);

export const financeWildTerritoryValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1000),
    })
);

export const buyInfantryValidator = vine.compile(
    vine.object({
        amount: vine.number().min(1000),
    })
);

export const buyShipsValidator = vine.compile(
    vine.object({
        amount: vine.number().min(5),
    })
);

export const declareWarParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const askPeaceParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const makePeaceParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const refusePeaceParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);

export const cancelPendingPeaceParamsValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);
