export const up = async (knex) => {
  await knex.schema.createTable("fields", (table) => {
    table.increments("id")
    table
      .text("type")
      .checkIn([
        "single line text",
        "multi line text",
        "radio",
        "select",
        "checkbox",
      ])
    table.text("label")
    table.text("options")
    table.text("defaultValue")
  })
}
export const down = async (knex) => {
  await knex.schema.dropTable("fields")
}
