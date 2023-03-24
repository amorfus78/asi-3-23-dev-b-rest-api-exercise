import FieldsModel from "../db/models/FieldsModel.js"
import auth from "../middlewares/auth.js"
import validate from "../middlewares/validate.js"
import {
  idValidator,
  limitValidator,
  pageValidator,
  stringValidator,
  fieldsTypeValidator,
} from "../validators.js"

const prepareNavMenuRoutes = ({ app }) => {
  app.post(
    "/fields",
    auth,
    validate({
      body: {
        type: fieldsTypeValidator.required(),
        label: stringValidator.required(),
        options: stringValidator,
        defaultValue: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const localUser = req.locals.session.user

      if (localUser.roleId != 1 && localUser.roleId != 2) {
        res.status(403).send({ error: "Forbidden" })
      }

      const { type, label, options, defaultValue } = req.body

      await FieldsModel.query().insert({
        type: type,
        label: label,
        options: options,
        defaultValue: defaultValue,
      })

      res.send({ result: "OK" })
    }
  )
  app.get(
    "/fields",
    validate({
      query: {
        limit: limitValidator.required(),
        page: pageValidator.required(),
      },
    }),
    async (req, res) => {
      const { limit, page } = req.locals.query

      const fields = await FieldsModel.query()
        .select()
        .modify("paginate", limit, page)
      res.send({ result: fields })
    }
  )
  app.get(
    "/fields/:fieldsId",
    validate({ params: { fieldsId: idValidator.required() } }),
    async (req, res) => {
      const id = req.params.fieldsId

      const field = await FieldsModel.query().findOne({ id })

      if (!field) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      res.send({ result: field })
    }
  )
  app.patch(
    "/fields/:fieldsId",
    auth,
    validate({
      body: {
        type: fieldsTypeValidator,
        label: stringValidator,
        options: stringValidator,
        defaultValue: stringValidator,
      },
    }),
    async (req, res) => {
      const id = req.params.fieldsId

      const localUser = req.locals.session.user

      if (localUser.roleId != 1 && localUser.roleId != 2) {
        res.status(403).send({ error: "Forbidden" })
      }

      const field = await FieldsModel.query().findOne({ id })

      if (!field) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      const { type, label, options, defaultValue } = req.body

      const payload = {
        type: type ? type : field.type,
        label: label ? label : field.label,
        options: options ? options : field.options,
        defaultValue: defaultValue ? defaultValue : field.defaultValue,
      }

      await FieldsModel.query().findOne({ id }).patch(payload)

      res.send({ result: "OK" })
    }
  )
  app.delete("/fields/:fieldsId", auth, async (req, res) => {
    const id = req.params.fieldsId

    const localUser = req.locals.session.user

    if (localUser.roleId != 1 && localUser.roleId != 2) {
      res.status(403).send({ error: "Forbidden" })
    }

    const field = await FieldsModel.query().findOne({ id })

    if (!field) {
      res.status(404).send({ error: "Not Found" })

      return
    }

    await FieldsModel.query().findOne({ id }).delete()

    res.send({ result: "OK" })
  })
}

export default prepareNavMenuRoutes
