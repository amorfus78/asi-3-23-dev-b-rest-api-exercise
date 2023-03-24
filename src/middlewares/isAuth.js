import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"

const isAuth = (req, res, next) => {
  const jwt = req.headers.authorization?.slice(7)

  if (jwt) {
    try {
      const { payload } = jsonwebtoken.verify(jwt, config.security.jwt.secret)
      req.locals.session = payload

      console.log(payload)
      next()
    } catch (err) {
      if (err instanceof jsonwebtoken.JsonWebTokenError) {
        req.locals.session = { user: "Not authenticated" }

        next()
      }

      console.error(err)

      res.status(500).send({ error: "Oops. Something went wrong." })
    }
  } else {
    req.locals.session = { user: "Not authenticated" }
    next()
  }
}

export default isAuth
