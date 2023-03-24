import prepareSignRoutes from "./routes/prepareSignRoutes.js"
import prepareUserRoutes from "./routes/prepareUserRoutes.js"
import preparePageRoutes from "./routes/preparePageRoutes.js"
import prepareNavMenuRoutes from "./routes/prepareNavMenuRoutes.js"

const prepareRoutes = (ctx) => {
  prepareSignRoutes(ctx)
  prepareUserRoutes(ctx)
  preparePageRoutes(ctx)
  prepareNavMenuRoutes(ctx)
}

export default prepareRoutes
