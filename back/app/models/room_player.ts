import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Room from '#models/room';
import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import Language from '#models/language';
import Bot from '#models/bot';
import PlayableCountry from '#models/playable_country';
import BotDifficulty from '#models/bot_difficulty';

export default class RoomPlayer extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare score: number;

    @column()
    declare userId: string;

    @belongsTo((): typeof User => User)
    declare user: BelongsTo<typeof User>;

    @column()
    declare botId: string;

    @belongsTo((): typeof Bot => Bot)
    declare bot: BelongsTo<typeof Bot>;

    @column()
    declare isUserConnected: boolean;

    @column()
    declare isReady: boolean;

    @column()
    declare gold: number;

    @column()
    declare difficultyId: string;

    @belongsTo((): typeof BotDifficulty => BotDifficulty, {
        foreignKey: 'difficultyId',
    })
    declare difficulty: BelongsTo<typeof BotDifficulty>;

    @column()
    declare countryId: string;

    @belongsTo((): typeof PlayableCountry => PlayableCountry, {
        foreignKey: 'countryId',
    })
    declare country: BelongsTo<typeof PlayableCountry>;

    @column()
    declare roomId: string;

    @belongsTo((): typeof Room => Room)
    declare room: BelongsTo<typeof Room>;

    @column.dateTime({ autoCreate: true })
    declare lastHeartbeat: DateTime;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedRoomPlayer {
        return {
            id: this.frontId,
            score: this.score,
            user: this.user?.apiSerialize(),
            bot: this.bot?.apiSerialize(language),
            country: this.country.apiSerialize(language),
            isUserConnected: this.isUserConnected,
            isReady: this.isReady,
            gold: this.gold,
            difficulty: this.difficulty?.apiSerialize(language),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
