import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class BlockedUser extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare blockerId: string;

    @belongsTo((): typeof User => User)
    declare blocker: BelongsTo<typeof User>;

    @column()
    declare blockedId: string;

    @belongsTo((): typeof User => User)
    declare blocked: BelongsTo<typeof User>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;
}
