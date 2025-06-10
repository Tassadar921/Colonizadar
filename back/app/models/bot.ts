import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import Language from '#models/language';
import SerializedBot from '#types/serialized/serialized_bot';
import File from '#models/file';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { Translation, translation } from '@stouder-io/adonis-translatable';

export default class Bot extends BaseModel {
    @column({ isPrimary: true })
    declare id: string;

    @column()
    declare frontId: number;

    @column()
    declare code: string;

    @translation()
    declare name: Translation;

    @column()
    declare pictureId: string | null;

    @belongsTo((): typeof File => File, {
        foreignKey: 'pictureId',
    })
    declare picture: BelongsTo<typeof File>;

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime;

    public apiSerialize(language: Language): SerializedBot {
        return {
            id: this.frontId,
            name: this.name.get(language.code) ?? this.name.get('en') ?? '',
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        };
    }
}
