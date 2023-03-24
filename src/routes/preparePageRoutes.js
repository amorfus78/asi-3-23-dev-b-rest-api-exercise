import PageModel from "../db/models/PageModel.js"
import auth from "../middlewares/auth.js"
import isAuth from "../middlewares/isAuth.js"
import validate from "../middlewares/validate.js"
import {
  displayNameValidator,
  roleIdValidator,
  textValidator,
  statusValidator,
  dateValidator,
  limitValidator,
  pageValidator,
  stringValidator,
  idValidator,
} from "../validators.js"

const preparePageRoutes = ({ app }) => {
  app.post(
    "/pages",
    auth,
    validate({
      body: {
        title: displayNameValidator.required(),
        content: displayNameValidator,
        urlSlug: textValidator.required(),
        creatorId: roleIdValidator.required(),
        usersIds: textValidator,
        publishedDate: dateValidator,
        status: statusValidator,
      },
    }),
    async (req, res) => {
      const localUser = req.locals.session.user

      if (localUser.roleId != 1 && localUser.roleId != 2) {
        res.status(403).send({ error: "Forbidden" })
      }

      const {
        title,
        content,
        urlSlug,
        creatorId,
        usersIds,
        publishedDate,
        status,
      } = req.body

      const page = await PageModel.query().findOne({ urlSlug })

      if (page) {
        res.send({
          error: "url already taken",
        })
      }

      await PageModel.query().insert({
        title: title,
        content: content,
        urlSlug: urlSlug,
        creatorId: creatorId,
        usersIds: usersIds,
        publishedDate: publishedDate,
        status: status,
      })

      res.send({ result: "OK" })
    }
  )
  app.get(
    "/pages",
    isAuth,
    validate({
      query: {
        limit: limitValidator.required(),
        page: pageValidator.required(),
      },
    }),
    async (req, res) => {
      var query = PageModel.query().select()

      const { limit, page } = req.locals.query

      if (req.locals.session.user == "Not authenticated") {
        query = query.where("status", "=", "published")
      }

      const pages = await query.modify("paginate", limit, page)

      res.send({ result: pages })
    }
  )
  app.get("/pages/:pageId", isAuth, async (req, res) => {
    const id = req.params.pageId

    var page = await PageModel.query().findOne({ id })

    if (!page) {
      res.status(404).send({ error: "Not Found" })

      return
    }

    if (
      req.locals.session.user === "Not authenticated" &&
      page.status === "draft"
    ) {
      res.send({ error: "No crendentials to access this resource" })

      return
    }

    res.send({ result: page })
  })
  app.patch(
    "/pages/:pageId",
    auth,
    validate({
      body: {
        title: displayNameValidator,
        content: displayNameValidator,
        urlSlug: stringValidator,
        creatorId: idValidator,
        usersIds: stringValidator,
        publishedDate: dateValidator,
        status: statusValidator,
      },
    }),
    async (req, res) => {
      const id = req.params.pageId

      const page = await PageModel.query().findOne({ id })

      if (!page) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      const {
        title,
        content,
        urlSlug,
        creatorId,
        usersIds,
        publishedDate,
        status,
      } = req.body

      const payload = {
        title: title ? title : page.title,
        content: content ? content : page.content,
        urlSlug: urlSlug ? urlSlug : page.urlSlug,
        creatorId: creatorId ? creatorId : page.creatorId,
        usersIds: usersIds ? usersIds : page.usersIds,
        publishedDate: publishedDate ? publishedDate : page.publishedDate,
        status: status ? status : page.status,
      }

      await PageModel.query().findOne({ id }).patch(payload)

      res.send({ result: "OK" })
    }
  )
  app.delete("/pages/:pageId", auth, async (req, res) => {
    const localUser = req.locals.session.user
    const id = req.params.pageId

    if (localUser.roleId == 1 || localUser.roleId == 2) {
      const page = await PageModel.query().findOne({ id })

      if (!page) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      await PageModel.query().deleteById(id)

      res.send({ result: "OK" })
    }
  })
}

export default preparePageRoutes
