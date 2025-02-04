import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import RoomPlayerDifficultyEnum from '#types/enum/room_player_difficulty_enum';

export default class extends BaseSchema {
    protected tableName: string = 'room_players';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
            table.uuid('bot_name_id').nullable().references('id').inTable('bot_names').onDelete('CASCADE');
            table.boolean('is_user_connected').defaultTo(false);
            table.enum('difficulty', Object.values(RoomPlayerDifficultyEnum)).notNullable().defaultTo(RoomPlayerDifficultyEnum.MEDIUM);
            table.uuid('room_id').notNullable().references('id').inTable('rooms').onDelete('CASCADE');
            table.timestamp('last_heartbeat', { useTz: true });
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
