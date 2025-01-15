import { BaseSchema } from '@adonisjs/lucid/schema'
import { Knex } from 'knex'

export default class extends BaseSchema {
    protected tableName: string = 'uploaded_files'

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
            table.specificType('front_id', 'serial').notNullable()
            table.string('title').notNullable()
            table.uuid('user_id').nullable().references('id').inTable('users')
            table.uuid('file_id').nullable().references('id').inTable('files')
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName)
    }
}
