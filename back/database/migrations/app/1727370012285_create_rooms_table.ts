import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import RoomStatusEnum from '#types/enum/room_status_enum';

export default class extends BaseSchema {
    protected tableName: string = 'rooms';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('name', 255).notNullable();
            table.boolean('public').defaultTo(true);
            table.string('password', 255).nullable();
            table.uuid('token').defaultTo(this.raw('uuid_generate_v4()'));
            table.enum('status', Object.values(RoomStatusEnum)).notNullable().defaultTo(RoomStatusEnum.OPENED);
            table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.uuid('map_id').notNullable().references('id').inTable('maps').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
