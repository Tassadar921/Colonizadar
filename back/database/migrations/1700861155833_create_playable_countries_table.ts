import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'playable_countries';

    public async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('english_name', 255).notNullable();
            table.string('french_name', 255).notNullable();
            table.string('color', 255).notNullable();
            table.integer('infantry_attack').notNullable();
            table.integer('infantry_defense').notNullable();
            table.integer('infantry_price').notNullable();
            table.integer('ship_attack').notNullable();
            table.integer('ship_defense').notNullable();
            table.integer('ship_price').notNullable();
            table.integer('landing_attack').notNullable();
            table.integer('landing_defense').notNullable();
            table.uuid('flag_id').nullable().references('id').inTable('files');
            table.uuid('map_id').notNullable().references('id').inTable('maps');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }

    public async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
