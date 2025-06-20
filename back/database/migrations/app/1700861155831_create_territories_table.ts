import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'territories';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.string('code', 3).notNullable();
            table.json('name').notNullable();
            table.boolean('is_coastal').notNullable().defaultTo(false);
            table.boolean('is_factory').notNullable().defaultTo(false);
            table.integer('default_infantry').nullable();
            table.integer('default_ships').nullable();
            table.uuid('map_id').notNullable().references('id').inTable('maps').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
