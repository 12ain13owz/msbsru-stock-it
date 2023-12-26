import { Sequelize, DataTypes, Model } from "sequelize";

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  fistname: string;
  lastname: string;
  role: number;
  remark: string;
  active: boolean;
}

class UserModel extends Model<UserAttributes> {}
export function UserFactory(sequelize: Sequelize) {
  UserModel.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: {
        type: DataTypes.STRING(),
        unique: true,
        allowNull: false,
        validate: { isEmail: true, isLowercase: true },
      },
      password: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: { min: 6 },
      },
      fistname: { type: DataTypes.STRING(50), allowNull: false },
      lastname: { type: DataTypes.STRING(50), allowNull: false },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 1, //  0 = admin / 1 = user
        allowNull: false,
        validate: { is: /^[01]{1}$}/ },
      },
      remark: { type: DataTypes.STRING(500) },
      active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
      indexes: [{ unique: true, fields: ["email"] }],
    }
  );

  return UserModel;
}
