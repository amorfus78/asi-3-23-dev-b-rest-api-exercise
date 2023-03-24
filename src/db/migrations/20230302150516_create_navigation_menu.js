export const up = async (knex) => {
  await knex.schema.createTable("navMenu", (table) => {
    table.increments("id")
    table.text("name")
    table.text("textList")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("navMenu")
}
