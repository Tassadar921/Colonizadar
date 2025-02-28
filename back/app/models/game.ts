import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Room from '#models/room';
import SerializedGame from '#types/serialized/serialized_game';
import RoomPlayer from '#models/room_player';
import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import Language from '#models/language';

export default class Game extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare roomId: string;

    @belongsTo((): typeof Room => Room)
    declare room: BelongsTo<typeof Room>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedGame {
        return {
            id: this.frontId,
            players: this.room.players.map((player: RoomPlayer): SerializedRoomPlayer => player.apiSerialize(language)),
            createdAt: this.createdAt.toString(),
            updatedAt: this.updatedAt.toString(),
        };
    }
}
