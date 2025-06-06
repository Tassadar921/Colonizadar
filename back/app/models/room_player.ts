import { DateTime } from 'luxon';
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Room from '#models/room';
import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import Language from '#models/language';
import Bot from '#models/bot';
import PlayableCountry from '#models/playable_country';
import BotDifficulty from '#models/bot_difficulty';
import War from '#models/war';
import Peace from '#models/peace';
import PendingPeace from '#models/pending_peace';
import SerializedPeace from '#types/serialized/serialized_peace';
import SerializedWar from '#types/serialized/serialized_war';
import GameTerritory from '#models/game_territory';

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

    @hasMany((): typeof GameTerritory => GameTerritory, {
        foreignKey: 'ownerId',
    })
    declare territories: HasMany<typeof GameTerritory>;

    @hasMany((): typeof War => War, {
        foreignKey: 'playerId',
    })
    declare wars: HasMany<typeof War>;

    @hasMany((): typeof Peace => Peace, {
        foreignKey: 'playerId',
    })
    declare peaces: HasMany<typeof Peace>;

    @hasMany((): typeof PendingPeace => PendingPeace, {
        foreignKey: 'enemyId',
    })
    declare receivedPendingPeaces: HasMany<typeof PendingPeace>;

    @hasMany((): typeof PendingPeace => PendingPeace, {
        foreignKey: 'playerId',
    })
    declare sentPendingPeaces: HasMany<typeof PendingPeace>;

    @column.dateTime({ autoCreate: true })
    declare lastHeartbeat: DateTime;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    @beforeFind()
    @beforeFetch()
    public static preloadDefaults(query: any): void {
        query.preload('user', (userQuery: any): void => {
            userQuery.preload('profilePicture');
        })
            .preload('bot').preload('country').preload('difficulty');
    }

    public apiSerialize(language: Language, user?: User, isSpied = false): SerializedRoomPlayer {
        return {
            id: this.frontId,
            score: this.score,
            user: this.user?.apiSerialize(),
            bot: this.bot?.apiSerialize(language),
            country: this.country.apiSerialize(language),
            isUserConnected: this.isUserConnected,
            isReady: this.isReady,
            gold: this.userId === user?.id || isSpied ? this.gold : undefined,
            wars: this.wars?.map((war: War): SerializedWar => war.apiSerialize(language)),
            peaces: this.peaces?.map((peace: Peace): SerializedPeace => peace.apiSerialize(language)),
            receivedPendingPeaces: this.receivedPendingPeaces?.map((pendingPeace: PendingPeace): SerializedRoomPlayer => pendingPeace.player.apiSerialize(language)),
            sentPendingPeaces: this.sentPendingPeaces?.map((pendingPeace: PendingPeace): SerializedRoomPlayer => pendingPeace.enemy.apiSerialize(language)),
            difficulty: this.difficulty?.apiSerialize(language),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
