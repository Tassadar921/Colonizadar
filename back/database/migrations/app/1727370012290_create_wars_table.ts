import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import WarStatusEnum from '#types/enum/war_status_enum';

export default class extends BaseSchema {
    protected tableName: string = 'wars';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.enum('status', Object.values(WarStatusEnum)).notNullable();
            table.integer('start_season').notNullable();
            table.integer('start_year').notNullable();
            table.integer('end_season').nullable();
            table.integer('end_year').nullable();
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
