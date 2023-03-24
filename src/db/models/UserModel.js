import BaseModel from "./BaseModel.js"
import RoleModel from "./RoleModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static relationMappings() {
    return {
      author: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.roleId",
          to: "roles.id",
        },
        modify: (query) => query.select("id", "name"),
      },
    }
  }
}

export default UserModel
