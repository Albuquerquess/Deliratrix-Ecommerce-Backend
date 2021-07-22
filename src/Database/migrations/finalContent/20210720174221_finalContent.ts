import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('final_content', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('create_id').notNullable()
        table.string('url').notNullable()

        table.timestamp('registered_at').defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('final_content')
}

