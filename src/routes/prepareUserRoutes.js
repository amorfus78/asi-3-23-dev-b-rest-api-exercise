import UserModel from "../db/models/UserModel.js"
import auth from "../middlewares/auth.js"
import validate from "../middlewares/validate.js"
import {
  pageValidator,
  limitValidator,
  displayNameValidator,
  emailValidator,
  passwordValidator,
  roleIdValidator,
} from "../validators.js"

const prepareUserRoutes = ({ app }) => {
  app.get(
    "/users",
    auth,
    validate({
      query: {
        limit: limitValidator.required(),
        page: pageValidator.required(),
      },
    }),
    async (req, res) => {
      const localUser = req.locals.session.user

      if (localUser.roleId != 1) {
        res.status(403).send({ error: "Forbidden" })
      }

      const { limit, page } = req.locals.query
      //const users = await db("users")

      const users = await UserModel.query().modify("paginate", limit, page)
      console.log(users)

      res.send({ result: { users } })
    }
  )
  app.get("/users/:userId", auth, async (req, res) => {
    const localUser = req.locals.session.user
    const id = req.params.userId

    if (localUser.roleId != 1 && localUser.id != id) {
      res.status(403).send({ error: "Forbidden" })
    }

    const user = await UserModel.query().findOne({ id })

    res.send({
      result: {
        user,
      },
    })
  })
  app.patch(
    "/users/:userId",
    auth,
    validate({
      body: {
        firstName: displayNameValidator,
        lastName: displayNameValidator,
        email: emailValidator,
        password: passwordValidator,
        roleId: roleIdValidator,
      },
    }),
    async (req, res) => {
      const localUser = req.locals.session.user
      const id = req.params.userId

      if (localUser.roleId != 1 && localUser.id != id) {
        res.status(403).send({ error: "Forbidden" })
      }

      const user = await UserModel.query().findOne({ id })

      const payload = {
        firstName: req.body.firstName ? req.body.firstName : user.firstName,
        lastName: req.body.lastName ? req.body.lastName : user.lastName,
        email: req.body.email ? req.body.email : user.email,
        password: req.body.password ? req.body.password : user.password,
        roleId:
          localUser.roleId === 1
            ? req.body.roleId
              ? req.body.roleId
              : user.roleId
            : user.roleId,
      }

      await UserModel.query().findOne({ id }).patch(payload)

      res.send({ result: "OK" })
    }
  )
  // Full update
  app.put(
    "/users/:userId",
    auth,
    validate({
      body: {
        firstName: displayNameValidator.required(),
        lastName: displayNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        roleId: roleIdValidator.required(),
      },
    }),
    async (req, res) => {
      const localUser = req.locals.session.user
      const id = req.params.userId

      if (localUser.roleId != 1 && localUser.id != id) {
        res.status(403).send({ error: "Forbidden" })
      }

      const user = await UserModel.query().findOne({ id })

      const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        roleId: localUser.roleId === 1 ? req.body.roleId : user.roleId,
      }

      await UserModel.query().findOne({ id }).patch(payload)

      res.send({ result: "OK" })
    }
  )
  app.delete("/users/:userId", auth, async (req, res) => {
    const localUser = req.locals.session.user
    const id = req.params.userId

    if (localUser.id == 1) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    const user = await UserModel.query().findOne({ id })

    if (!user) {
      res.status(404).send({ error: "Not Found" })

      return
    }

    await UserModel.query().deleteById(id)

    res.send({ result: "OK" })
  })
}

export default prepareUserRoutes
