import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import Room from '#models/room';
import SerializedGame from '#types/serialized/serialized_game';
import RoomPlayer from '#models/room_player';
import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import Language from '#models/language';
import GameTerritory from '#models/game_territory';
import SerializedGameTerritory from '#types/serialized/serialized_game_territory';
import Map from '#models/map';
import User from '#models/user';

export default class Game extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare season: number;

    @column()
    declare year: number;

    @column()
    declare roomId: string;

    @belongsTo((): typeof Room => Room)
    declare room: BelongsTo<typeof Room>;

    @hasMany((): typeof GameTerritory => GameTerritory)
    declare territories: HasMany<typeof GameTerritory>;

    @column()
    declare mapId: string;

    @belongsTo((): typeof Map => Map)
    declare map: BelongsTo<typeof Map>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language, user: User): SerializedGame {
        return {
            id: this.frontId,
            name: this.room.name,
            season: this.season,
            year: this.year,
            owner: this.room.owner.apiSerialize(),
            players: this.room.players.map((player: RoomPlayer): SerializedRoomPlayer => player.apiSerialize(language, user)),
            territories: this.territories.map((territory: GameTerritory): SerializedGameTerritory => territory.apiSerialize(language, user)),
            createdAt: this.createdAt.toString(),
            updatedAt: this.updatedAt.toString(),
        };
    }
}
