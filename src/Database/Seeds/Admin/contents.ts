import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("typesAndCategories").del();

    // Inserts seed entries
    await knex("typesAndCategories").insert([
        { type: 'product', category: "pack" },
        { type: 'product', category: "fetish" },
        { type: 'product', category: "slave" },
        { type: 'product', category: "scat" },
        { type: 'service', category: "bdsm" },
        { type: 'service', category: "items usados" },
        { type: 'service', category: "contos" },
        { type: 'service', category: "sexting" },
        { type: 'service', category: "dick rating" },
        { type: 'service', category: "conselhos" },
    ]);
};
