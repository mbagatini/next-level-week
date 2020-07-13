import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("point_items", (table) => {
    table.increments("id").primary();

    table.integer("point").unsigned().notNullable();
    table.foreign("item").references("id").inTable("points");

    table.integer("item").unsigned().notNullable();
    table.foreign("item").references("id").inTable("items");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("point_items");
}
