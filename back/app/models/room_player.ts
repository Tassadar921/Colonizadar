import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import RoomPlayerDifficultyEnum from '#types/enum/room_player_difficulty_enum';
import Room from '#models/room';
import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import BotName from "#models/bot_name";
import Language from "#models/language";

export default class RoomPlayer extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare userId: string;

    @belongsTo((): typeof User => User)
    declare user: BelongsTo<typeof User>;

    @column()
    declare BotNameId: string;

    @belongsTo((): typeof BotName => BotName)
    declare BotName: BelongsTo<typeof BotName>;

    // field used to know if the user is connected once in-game
    @column()
    declare isUserConnected: boolean;

    @column()
    declare difficulty: RoomPlayerDifficultyEnum;

    @column()
    declare roomId: string;

    @belongsTo((): typeof Room => Room)
    declare room: BelongsTo<typeof Room>;

    @column.dateTime({ autoCreate: true })
    declare lastHeartbeat: DateTime;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedRoomPlayer {
        return {
            id: this.frontId,
            user: this.user?.apiSerialize(),
            botName: this.BotName?.translate(language),
            isUserConnected: this.isUserConnected,
            difficulty: this.difficulty,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
