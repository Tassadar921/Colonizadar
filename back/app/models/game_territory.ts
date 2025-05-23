import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Game from '#models/game';
import Territory from '#models/territory';
import SerializedGameTerritory from '#types/serialized/serialized_game_territory';
import RoomPlayer from '#models/room_player';
import User from '#models/user';

export default class GameTerritory extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare infantry: number;

    @column()
    declare ships: number;

    @column()
    declare value: number;

    @column()
    declare isFortified: boolean;

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

    public apiSerialize(language: Language, user: User, isSpied: boolean = false): SerializedGameTerritory {
        return {
            id: this.frontId,
            infantry: this.owner?.userId === user.id || isSpied ? this.infantry : undefined,
            ships: this.owner?.userId === user.id || isSpied ? this.ships || 0 : undefined,
            value: this.value,
            isFortified: this.isFortified,
            owner: this.owner?.apiSerialize(language, user),
            territory: this.territory.apiSerialize(language, true),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
