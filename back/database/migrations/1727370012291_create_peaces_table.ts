import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'peaces';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.integer('expiration_season').notNullable();
            table.integer('expiration_year').notNullable();
            table.uuid('player_id').notNullable().references('id').inTable('room_players').onDelete('CASCADE');
            table.uuid('enemy_id').notNullable().references('id').inTable('room_players').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
