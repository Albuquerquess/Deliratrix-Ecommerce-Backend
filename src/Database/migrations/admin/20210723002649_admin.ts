import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('typesAndCategories', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('type').notNullable()
        table.string('category').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
    })
    .createTable('bestSeller', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('content_id').notNullable()
    })
    
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('typesAndCategories')
    .dropTable('bestSeller')
}

