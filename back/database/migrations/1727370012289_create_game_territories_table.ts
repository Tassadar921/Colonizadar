import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'game_territories';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.integer('power').notNullable().defaultTo(1);
            table.integer('ships').notNullable().defaultTo(0);
            table.uuid('owner_id').nullable().references('id').inTable('room_players').onDelete('CASCADE');
            table.uuid('territory_id').notNullable().references('id').inTable('territories').onDelete('CASCADE');
            table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
