import express from "express"
import knex from "knex"
import config from "./src/config.js"
import BaseModel from "./src/db/models/BaseModel.js"
import prepareRoutes from "./src/prepareRoutes.js"

const db = knex(config.db)

const app = express()

BaseModel.knex(db)

app.use((req, res, next) => {
  req.locals = {}

  next()
})

app.use(express.json())

const ctx = {
  app,
  db,
}

prepareRoutes(ctx)

app.listen(config.port, () => console.log(`Listening on :${config.port}`))
