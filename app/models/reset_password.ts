import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ResetPassword extends BaseModel {
    @column({ isPrimary: true })
    declare id: string

    @column()
    declare userId: string

    @belongsTo((): typeof User => User)
    declare user: BelongsTo<typeof User>

    @column()
    declare token: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
