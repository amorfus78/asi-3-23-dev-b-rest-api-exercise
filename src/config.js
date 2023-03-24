import "dotenv/config"
import knexfile from "../knexfile.js"

const config = {
  port: process.env.PORT,

  db: knexfile,
  logger: {
    format: process.env.LOGGER_FORMAT || "dev",
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET,
      options: {
        expiresIn: "2 days",
      },
    },
    password: {
      saltLen: 128,
      keylen: 128,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
    },
  },
}

export default config
