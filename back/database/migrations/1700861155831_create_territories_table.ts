import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'territories';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('code', 3).notNullable().unique();
            table.string('english_name', 255).notNullable();
            table.string('french_name', 255).notNullable();
            table.boolean('is_coastal').notNullable().defaultTo(false);
            table.boolean('is_factory').notNullable().defaultTo(false);
            table.uuid('map_id').notNullable().references('id').inTable('maps');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
