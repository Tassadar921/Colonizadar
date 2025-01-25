import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPeopleDifficultyEnum from '#types/enum/room_people_difficulty_enum';
import Room from '#models/room';

export default class RoomPerson extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare userId: string;

    @belongsTo((): typeof User => User)
    declare user: BelongsTo<typeof User>;

    @column()
    declare difficulty: RoomPeopleDifficultyEnum;

    @column()
    declare roomId: string;

    @belongsTo((): typeof Room => Room)
    declare room: BelongsTo<typeof Room>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
