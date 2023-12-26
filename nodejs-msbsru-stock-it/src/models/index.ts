import { Sequelize } from "sequelize";
import config from "config";
import { UserFactory } from "./user.model";
import { StockFactory } from "./stock.model";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.get<string>("storage"),
});

const UserModel = UserFactory(sequelize);
const StockModel = StockFactory(sequelize);

// relation one to many
UserModel.hasMany(StockModel, {
  foreignKey: { name: "user_id", field: "user_id" },
});
StockModel.belongsTo(UserModel, { foreignKey: "id" });

export default sequelize;
export { UserModel, StockModel };
