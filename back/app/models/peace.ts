import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPlayer from '#models/room_player';
import Language from '#models/language';
import SerializedPeace from '#types/serialized/serialized_peace';
import PeaceStatusEnum from '#types/enum/peace_status_enum';
import War from '#models/war';

export default class Peace extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare status: PeaceStatusEnum;

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

    @column()
    declare warId: string;

    @belongsTo((): typeof War => War)
    declare war: BelongsTo<typeof War>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedPeace {
        return {
            id: this.frontId,
            status: this.status,
            expirationSeason: this.expirationSeason,
            expirationYear: this.expirationYear,
            enemy: this.enemy.apiSerialize(language),
            war: this.war.apiSerialize(language),
            updatedAt: this.updatedAt?.toString(),
            createdAt: this.createdAt?.toString(),
        };
    }
}
