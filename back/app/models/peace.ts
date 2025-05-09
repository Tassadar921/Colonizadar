import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPlayer from '#models/room_player';
import Language from '#models/language';
import SerializedPeace from '#types/serialized/serialized_peace';

export default class Peace extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare expirationSeason: number;

    @column()
    declare expirationYear: number;

    @column()
    declare playerId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer)
    declare player: BelongsTo<typeof RoomPlayer>;

    @column()
    declare enemyId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer, {
        foreignKey: 'enemyId',
    })
    declare enemy: BelongsTo<typeof RoomPlayer>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedPeace {
        return {
            id: this.frontId,
            expirationSeason: this.expirationSeason,
            expirationYear: this.expirationYear,
            enemy: this.enemy.apiSerialize(language),
            updatedAt: this.updatedAt?.toString(),
            createdAt: this.createdAt?.toString(),
        };
    }
}
