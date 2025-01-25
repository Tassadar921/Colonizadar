import { DateTime } from 'luxon';
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import hash from '@adonisjs/core/services/hash';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';
import RoomPerson from '#models/room_person';
import Game from '#models/game';

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
    declare password: string;

    @column()
    declare token: string;

    @column()
    declare ownerId: string;

    @column()
    declare gameId: string;

    @belongsTo((): typeof Game => Game)
    declare game: BelongsTo<typeof Game>;

    @belongsTo((): typeof User => User, {
        foreignKey: 'ownerId',
    })
    declare owner: BelongsTo<typeof User>;

    @hasMany((): typeof RoomPerson => RoomPerson)
    declare persons: HasMany<typeof RoomPerson>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    @beforeCreate()
    public static async setPassword(room: Room): Promise<void> {
        room.password = await hash.make(room.password);
    }
}
