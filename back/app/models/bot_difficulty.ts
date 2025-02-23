import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import SerializedBotDifficulty from '#types/serialized/serialized_bot_difficulty';
import Language from '#models/language';

export default class BotDifficulty extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare frenchName: string;

    @column()
    declare englishName: string;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public translate(language: Language): string {
        switch (language.code) {
            case 'fr':
                return this.frenchName;
            case 'en':
                return this.englishName;
            default:
                return this.englishName;
        }
    }

    public apiSerialize(language: Language): SerializedBotDifficulty {
        return {
            id: this.frontId,
            name: this.translate(language),
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
