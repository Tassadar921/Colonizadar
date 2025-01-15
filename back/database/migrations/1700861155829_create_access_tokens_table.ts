import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'auth_access_tokens';

    async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.uuid('tokenable_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.string('type').notNullable();
            table.string('name').nullable();
            table.string('hash').notNullable();
            table.text('abilities').notNullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
            table.timestamp('last_used_at').nullable();
            table.timestamp('expires_at').nullable();
        });
    }

    async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
