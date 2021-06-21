import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('services', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('size').notNullable()
        table.string('nameWithHash').notNullable()
        table.string('url').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        
    })
    .createTable('services_desc', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.string('type').notNullable()
        table.string('title').notNullable()
        table.string('desc').notNullable()
        table.string('services_id').notNullable()
        
        table.timestamp('registered_at').defaultTo(knex.fn.now())

        table.foreign('services_id').references('id').inTable('services')
    })

    .createTable('price', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('price').notNullable()
        table.string('label').notNullable()
        table.string('product_id').notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        
        table.foreign('product_id').references('id').inTable('services')
    })

    .createTable('rate', (table: Knex.TableBuilder) => {
        table.increments('id').primary()
        table.integer('rate').defaultTo(0).notNullable()
        table.timestamp('registered_at').defaultTo(knex.fn.now())
        table.string('product_id').notNullable()

        table.foreign('product_id').references('id').inTable('services')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('services')
    .dropTable('services_desc')
}

