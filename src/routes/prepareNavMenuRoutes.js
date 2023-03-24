import NavMenuModel from "../db/models/NavMenuModel.js"
import auth from "../middlewares/auth.js"
import validate from "../middlewares/validate.js"
import {
  displayNameValidator,
  idValidator,
  limitValidator,
  pageValidator,
  stringValidator,
} from "../validators.js"

const prepareNavMenuRoutes = ({ app }) => {
  app.post(
    "/navMenu",
    auth,
    validate({
      body: {
        name: displayNameValidator.required(),
        textList: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const localUser = req.locals.session.user

      if (localUser.roleId != 1 && localUser.roleId != 2) {
        res.status(403).send({ error: "Forbidden" })
      }

      const { name, textList } = req.body

      await NavMenuModel.query().insert({
        name: name,
        textList: textList,
      })

      res.send({ result: "OK" })
    }
  )
  app.get(
    "/navMenu",
    validate({
      query: {
        limit: limitValidator.required(),
        page: pageValidator.required(),
      },
    }),
    async (req, res) => {
      const { limit, page } = req.locals.query

      const navMenus = await NavMenuModel.query()
        .select()
        .modify("paginate", limit, page)
      res.send({ result: navMenus })
    }
  )
  app.get(
    "/navMenu/:navMenuId",
    validate({ params: { navMenuId: idValidator.required() } }),
    async (req, res) => {
      const id = req.params.navMenuId

      const navMenu = await NavMenuModel.query().findOne({ id })

      if (!navMenu) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      res.send({ result: navMenu })
    }
  )
  app.patch(
    "/navMenu/:navMenuId",
    auth,
    validate({
      body: {
        name: displayNameValidator,
        textList: stringValidator,
      },
    }),
    async (req, res) => {
      const id = req.params.navMenuId

      const localUser = req.locals.session.user

      if (localUser.roleId != 1 && localUser.roleId != 2) {
        res.status(403).send({ error: "Forbidden" })
      }

      const navMenu = await NavMenuModel.query().findOne({ id })

      if (!navMenu) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      const { name, textList } = req.body

      const payload = {
        name: name ? name : navMenu.name,
        textList: textList ? textList : textList,
      }

      await NavMenuModel.query().findOne({ id }).patch(payload)

      res.send({ result: "OK" })
    }
  )
  app.delete("/navMenu/:navMenuId", auth, async (req, res) => {
    const id = req.params.navMenuId

    const localUser = req.locals.session.user

    if (localUser.roleId != 1 && localUser.roleId != 2) {
      res.status(403).send({ error: "Forbidden" })
    }

    const navMenu = await NavMenuModel.query().findOne({ id })

    if (!navMenu) {
      res.status(404).send({ error: "Not Found" })

      return
    }

    await NavMenuModel.query().findOne({ id }).delete()

    res.send({ result: "OK" })
  })
}

export default prepareNavMenuRoutes
