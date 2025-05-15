import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'room_players';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.integer('score').notNullable().defaultTo(0);
            table.boolean('is_user_connected').defaultTo(false);
            table.boolean('is_ready').defaultTo(false);
            table.integer('gold').nullable();
            table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
            table.uuid('bot_id').nullable().references('id').inTable('bots').onDelete('CASCADE');
            table.uuid('difficulty_id').nullable().references('id').inTable('bot_difficulties').onDelete('CASCADE');
            table.uuid('room_id').notNullable().references('id').inTable('rooms').onDelete('CASCADE');
            table.uuid('country_id').notNullable().references('id').inTable('playable_countries').onDelete('CASCADE');
            table.timestamp('last_heartbeat', { useTz: true });
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
