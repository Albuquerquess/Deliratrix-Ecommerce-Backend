import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('cart', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('id_content').notNullable()
        table.string('txid').notNullable()
        table.string('name').notNullable()
        table.integer('value').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('cart')
}

