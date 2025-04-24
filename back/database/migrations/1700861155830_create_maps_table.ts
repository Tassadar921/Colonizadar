import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'maps';

    async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('name', 255).nullable();
            table.integer('main_season').notNullable().defaultTo(1);
            table.uuid('neutral_flag_id').notNullable().references('id').inTable('files').onDelete('CASCADE');
            table.uuid('created_by_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }

    async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
