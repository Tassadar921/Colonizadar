import { BaseSchema } from '@adonisjs/lucid/schema'
import { Knex } from 'knex'

export default class extends BaseSchema {
    protected tableName: string = 'files'

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
            table.string('name').notNullable()
            table.string('path').notNullable()
            table.string('extension').notNullable()
            table.string('mime_type').notNullable()
            table.integer('size').notNullable()
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName)
    }
}
