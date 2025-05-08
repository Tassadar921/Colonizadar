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
            table.decimal('infantry_attack_factor', 16, 10).notNullable();
            table.decimal('infantry_defense_factor', 16, 10).notNullable();
            table.decimal('infantry_price_factor', 16, 10).notNullable();
            table.decimal('ship_attack_factor', 16, 10).notNullable();
            table.decimal('ship_defense_factor', 16, 10).notNullable();
            table.decimal('ship_price_factor', 16, 10).notNullable();
            table.decimal('landing_attack_factor', 16, 10).notNullable();
            table.decimal('landing_defense_factor', 16, 10).notNullable();
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
