import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'bot_names';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('english', 255).notNullable();
            table.string('french', 255).notNullable();
            table.string('image_path', 512).notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
