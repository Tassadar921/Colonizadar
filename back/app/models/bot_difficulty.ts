import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import SerializedBotDifficulty from '#types/serialized/serialized_bot_difficulty';
import Language from '#models/language';
import { Translation, translation } from '@stouder-io/adonis-translatable';

export default class BotDifficulty extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare order: number;

    @column()
    declare isDefault: boolean;

    @translation()
    declare name: Translation;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedBotDifficulty {
        return {
            id: this.frontId,
            order: this.order,
            name: this.name.get(language.code) ?? this.name.get('en') ?? '',
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
