import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPlayer from '#models/room_player';
import WarStatusEnum from '#types/enum/war_status_enum';
import SerializedWar from '#types/serialized/serialized_war';
import Language from '#models/language';

export default class War extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare status: WarStatusEnum;

    @column()
    declare startSeason: number;

    @column()
    declare startYear: number;

    @column()
    declare endSeason: number;

    @column()
    declare endYear: number;

    @column()
    declare playerId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer, {
        foreignKey: 'playerId',
    })
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

    public apiSerialize(language: Language): SerializedWar {
        return {
            id: this.frontId,
            status: this.status,
            startSeason: this.startSeason,
            startYear: this.startYear,
            endSeason: this.endSeason,
            endYear: this.endYear,
            enemy: this.enemy.apiSerialize(language),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
