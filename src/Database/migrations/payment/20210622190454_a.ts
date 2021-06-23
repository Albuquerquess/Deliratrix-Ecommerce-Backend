import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('TmpPaymentInfos', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('phone').notNullable()
        table.string('txid').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('TmpPaymentInfos')
}

