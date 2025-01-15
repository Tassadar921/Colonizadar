import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import SerializedLanguage from '#types/serialized/serialized_language'

export default class Language extends BaseModel {
    public static LANGUAGE_FRENCH: { name: string; code: string } = {
        name: 'Français',
        code: 'fr',
    }
    public static LANGUAGE_ENGLISH: { name: string; code: string } = {
        name: 'English',
        code: 'en',
    }

    @column({ isPrimary: true })
    declare id: string

    @column()
    declare name: string

    @column()
    declare code: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    public apiSerialize(): SerializedLanguage {
        return {
            name: this.name,
            code: this.code,
            createdAt: this.createdAt?.toString(),
            updatedAt: this.updatedAt?.toString(),
        }
    }
}
