import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('content', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('size').notNullable()
        table.string('filename').notNullable()
        table.string('url').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
    })

    .createTable('desc', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('type').notNullable()
        table.string('category').nullable()
        table.string('title').notNullable()
        table.string('desc').notNullable()
        table.integer('content_id').notNullable()
        table.integer('time').defaultTo(0)
        table.timestamp('registered_at').defaultTo(knex.fn.now())

        table.foreign('content_id').references('id').inTable('content')
    })

    .createTable('price', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('price').notNullable()
        table.string('label').notNullable()
        table.integer('content_id').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        
        table.foreign('content_id').references('id').inTable('content')
    })

    .createTable('rate', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('rate').defaultTo(5).notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        table.integer('content_id').notNullable()

        table.foreign('content_id').references('id').inTable('content')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('content')
    .dropTable('desc')
    .dropTable('price')
    .dropTable('rate')
}

