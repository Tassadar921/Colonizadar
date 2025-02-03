import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';
import Language from "#models/language";

export default class BotName extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare french: string;

    @column()
    declare english: string;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public translate(language: Language): string {
        switch (language.code) {
            case 'fr':
                return this.french;
            case 'en':
                return this.english;
            default:
                return this.english;
        }
    }
}
