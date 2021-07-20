import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('tmp_debtor', (table: Knex.TableBuilder) => {
        table.increments('debtor_id').primary()
        table.string('name').notNullable()
        table.string('phone').notNullable()
        table.string('email').notNullable()
        table.string('txid').notNullable()
    })

    .createTable('tmp_cart', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('price').notNullable()
        table.string('content_id').notNullable()
        table.string('debtor_id').notNullable()
        table.string('txid').notNullable()
        
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        table.foreign('debtor_id').references('id').inTable('debtor')
    })
    

    
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('cart')
}

