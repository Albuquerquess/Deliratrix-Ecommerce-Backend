import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('size').notNullable()
        table.string('filename').notNullable()
        table.string('url').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
    })

    .createTable('desc', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('type').notNullable()
        table.string('category').notNullable()
        table.string('title').notNullable()
        table.string('desc').notNullable()
        table.string('product_id').notNullable()
        table.integer('time').defaultTo(0)
        table.timestamp('registered_at').defaultTo(knex.fn.now())

        table.foreign('product_id').references('id').inTable('products')
    })

    .createTable('price', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('price').notNullable()
        table.string('label').notNullable()
        table.string('product_id').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        
        table.foreign('product_id').references('id').inTable('products')
    })

    .createTable('rate', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('rate').defaultTo(0).notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        table.string('product_id').notNullable()

        table.foreign('product_id').references('id').inTable('products')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('products')
    .dropTable('products_desc')
}

