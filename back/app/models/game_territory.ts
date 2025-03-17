import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Game from '#models/game';
import Territory from '#models/territory';
import SerializedGameTerritory from '#types/serialized/serialized_game_territory';
import RoomPlayer from '#models/room_player';

export default class GameTerritory extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare ownerId: string;

    @belongsTo((): typeof RoomPlayer => RoomPlayer, {
        foreignKey: 'ownerId',
    })
    declare owner: BelongsTo<typeof RoomPlayer>;

    @column()
    declare territoryId: string;

    @belongsTo((): typeof Territory => Territory)
    declare territory: BelongsTo<typeof Territory>;

    @column()
    declare gameId: string;

    @belongsTo((): typeof Game => Game)
    declare game: BelongsTo<typeof Game>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedGameTerritory {
        return {
            id: this.frontId,
            owner: this.owner?.apiSerialize(language),
            territory: this.territory.apiSerialize(language),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
