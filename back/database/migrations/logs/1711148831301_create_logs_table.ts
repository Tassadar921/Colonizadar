import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';
import LogRouteMethodEnum from '#types/enum/log_route_method_enum';
import LogResponseStatusEnum from '#types/enum/log_response_status_enum';

export default class extends BaseSchema {
    protected tableName: string = 'logs';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('route', 255).notNullable();
            table.enum('route_method', Object.values(LogRouteMethodEnum)).notNullable();
            table.jsonb('query_string').notNullable().defaultTo('{}');
            table.jsonb('params').nullable();
            table.jsonb('body').nullable();
            table.enum('response_status', Object.values(LogResponseStatusEnum)).notNullable();
            table.jsonb('response_body').notNullable().defaultTo('{}');
            table.timestamp('start_time', { useTz: true }).notNullable();
            table.timestamp('end_time', { useTz: true }).notNullable();
            table.uuid('user_id').nullable().references('id').inTable('log_users').onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
