import { Sequelize, DataTypes, Model } from "sequelize";

interface StockAttributes {
  id: number;
  code: string;
  old_code: string;
  track: string;
  recived_date: Date;
  detail: string;
  print: boolean;
  status: boolean;
  remark: string;
  image: string;
}

class StockModel extends Model<StockAttributes> {}
export function StockFactory(sequelize: Sequelize) {
  StockModel.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
      old_code: { type: DataTypes.STRING(50) },
      track: { type: DataTypes.STRING(10), unique: true, allowNull: false },
      recived_date: { type: DataTypes.DATEONLY },
      detail: { type: DataTypes.STRING(), allowNull: false },
      print: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      remark: { type: DataTypes.STRING(500) },
      image: { type: DataTypes.STRING() },
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );

  return StockModel;
}
