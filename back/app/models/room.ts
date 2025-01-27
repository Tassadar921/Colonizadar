import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import hash from '@adonisjs/core/services/hash';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';
import RoomPlayer from '#models/room_player';
import Game from '#models/game';
import RoomStatusEnum from '#types/enum/room_status_enum';
import SerializedRoom from "#types/serialized/serialized_room";
import SerializedRoomPlayer from "#types/serialized/serialized_room_player";

export default class Room extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare name: string;

    @column()
    declare public: boolean;

    @column()
    declare password: string | null;

    @column()
    declare token: string;

    @column()
    declare status: RoomStatusEnum;

    @column()
    declare ownerId: string;

    @belongsTo((): typeof User => User, {
        foreignKey: 'ownerId',
    })
    declare owner: BelongsTo<typeof User>;

    @column()
    declare gameId: string;

    @belongsTo((): typeof Game => Game)
    declare game: BelongsTo<typeof Game>;

    @hasMany((): typeof RoomPlayer => RoomPlayer)
    declare players: HasMany<typeof RoomPlayer>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    @beforeCreate()
    public static async setPassword(room: Room): Promise<void> {
        if (room.password) {
            room.password = await hash.make(room.password);
        }
    }

    public apiSerialize(): SerializedRoom {
        return {
            id: this.frontId,
            name: this.name,
            public: this.public,
            token: this.token,
            status: this.status,
            owner: this.owner.apiSerialize(),
            players: this.players.map((player: RoomPlayer): SerializedRoomPlayer => player.apiSerialize()),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        }
    }
}
