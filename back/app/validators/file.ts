import vine from '@vinejs/vine';

export const serveStaticProfilePictureFileValidator = vine.compile(
    vine.object({
        userId: vine.number().positive(),
    })
);

export const serveStaticBotPictureFileValidator = vine.compile(
    vine.object({
        botId: vine.number().positive(),
    })
);

export const serveStaticCountryFlagFileValidator = vine.compile(
    vine.object({
        countryId: vine.number().positive(),
    })
);

export const serveStaticNeutralCountryFlagFileValidator = vine.compile(
    vine.object({
        mapId: vine.number().positive(),
    })
);

export const serveStaticFortifiedIconFileValidator = vine.compile(
    vine.object({
        mapId: vine.number().positive(),
    })
);

export const serveStaticFactoryIconFileValidator = vine.compile(
    vine.object({
        mapId: vine.number().positive(),
    })
);
