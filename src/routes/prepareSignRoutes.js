import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import validate from "../middlewares/validate.js"
import UserModel from "../db/models/RoleModel.js"
import {
  emailValidator,
  stringValidator,
  displayNameValidator,
  passwordValidator,
  roleIdValidator,
} from "../validators.js"

const prepareSignRoutes = ({ app, db }) => {
  app.post(
    "/sign-up",
    validate({
      body: {
        firstName: displayNameValidator,
        lastName: displayNameValidator,
        email: emailValidator.required(),
        password: passwordValidator.required(),
        roleId: roleIdValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, password, firstName, lastName, roleId } = req.locals.body

      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: "OK" })

        return
      }

      await db("users").insert({
        firstName,
        lastName,
        email,
        password,
        roleId,
      })

      res.send({ result: "OK" })
    }
  )
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
        password: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, password } = req.locals.body
      const [user] = await db("users").where({ email })

      if (!user) {
        res.send(401).send({ error: "Invalid credentials." })
      }

      if (password !== user.password) {
        res.status(401).send({ error: "Invalid credentials." })

        return
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
              roleId: user.roleId,
            },
          },
        },
        config.security.jwt.secret,
        config.security.jwt.options
      )

      res.send({ result: jwt })
    }
  )
}

export default prepareSignRoutes
