import prepareSignRoutes from "./routes/prepareSignRoutes.js"
import prepareUserRoutes from "./routes/prepareUserRoutes.js"
import preparePageRoutes from "./routes/preparePageRoutes.js"
import prepareNavMenuRoutes from "./routes/prepareNavMenuRoutes.js"
import prepareFieldsRoutes from "./routes/prepareFieldsRoutes.js"

const prepareRoutes = (ctx) => {
  prepareSignRoutes(ctx)
  prepareUserRoutes(ctx)
  preparePageRoutes(ctx)
  prepareNavMenuRoutes(ctx)
  prepareFieldsRoutes(ctx)
}

export default prepareRoutes
