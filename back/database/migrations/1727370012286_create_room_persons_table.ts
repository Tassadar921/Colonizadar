import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import RoomPeopleDifficultyEnum from '#types/enum/room_people_difficulty_enum';

export default class extends BaseSchema {
    protected tableName: string = 'room_persons';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.enum('difficulty', Object.values(RoomPeopleDifficultyEnum)).notNullable().defaultTo(RoomPeopleDifficultyEnum.MEDIUM);
            table.uuid('room_id').notNullable().references('id').inTable('rooms').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
