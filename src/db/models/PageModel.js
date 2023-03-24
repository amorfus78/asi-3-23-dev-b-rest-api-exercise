import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class PageModel extends BaseModel {
  static tableName = "pages"

  static relationMappings() {
    return {
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "pages.creatorId",
          to: "users.id",
        },
        modify: (query) => query.select("id", "name"),
      },
    }
  }
}

export default PageModel
