import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class Friend extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare user1Id: string;

    @belongsTo((): typeof User => User)
    declare user1: BelongsTo<typeof User>;

    @column()
    declare user2Id: string;

    @belongsTo((): typeof User => User)
    declare user2: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
