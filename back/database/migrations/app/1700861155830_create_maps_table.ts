import { BaseSchema } from '@adonisjs/lucid/schema';
import { Knex } from 'knex';

export default class extends BaseSchema {
    protected tableName: string = 'maps';

    async up(): Promise<void> {
        this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder): void => {
            table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
            table.specificType('front_id', 'serial').notNullable();
            table.string('name', 255).nullable();
            table.integer('main_season').notNullable().defaultTo(1);
            table.integer('starting_players_gold').notNullable();
            table.decimal('wild_infantry_cost_factor', 16, 10).notNullable();
            table.decimal('wild_infantry_defense_factor', 16, 10).notNullable();
            table.decimal('wild_landing_defense_factor', 16, 10).notNullable();
            table.decimal('base_infantry_cost', 16, 10).notNullable();
            table.decimal('base_ship_cost', 16, 10).notNullable();
            table.integer('spy_territory_cost').notNullable();
            table.integer('spy_fortified_territory_cost').notNullable();
            table.integer('spy_factory_cost').notNullable();
            table.integer('spy_player_cost').notNullable();
            table.decimal('finance_player_cost_factor', 16, 10).notNullable();
            table.integer('finance_player_step').notNullable();
            table.decimal('finance_wild_territory_cost_factor', 16, 10).notNullable();
            table.decimal('finance_wild_territory_enforcement_factor', 16, 10).notNullable();
            table.integer('finance_wild_territory_step').notNullable();
            table.decimal('wild_territory_subvert_factor', 16, 10).notNullable();
            table.integer('subvert_cost').notNullable();
            table.integer('fortify_cost').notNullable();
            table.integer('peace_seasons_interval').notNullable();
            table.uuid('neutral_flag_id').notNullable().references('id').inTable('files').onDelete('CASCADE');
            table.uuid('fortified_icon_id').notNullable().references('id').inTable('files').onDelete('CASCADE');
            table.uuid('factory_icon_id').notNullable().references('id').inTable('files').onDelete('CASCADE');
            table.uuid('created_by_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at');
            table.timestamp('updated_at');
        });
    }

    async down(): Promise<void> {
        this.schema.dropTable(this.tableName);
    }
}
