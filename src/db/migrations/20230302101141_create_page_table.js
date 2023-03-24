export const up = async (knex) => {
  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.text("urlSlug").notNullable().unique()
    table.integer("creatorId").notNullable().references("id").inTable("users")
    table.text("usersIds").notNullable()
    table.datetime("publishedDate")
    table.text("status").defaultTo("draft")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("pages")
}
