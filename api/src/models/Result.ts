import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "@/lib/sequelize";

export interface ResultAttributes {
  id: number;
  playerName: string;
  jsonInput: string;
  csvOutput: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Result
  extends Model<InferAttributes<Result>, InferCreationAttributes<Result>>
  implements ResultAttributes
{
  declare id: CreationOptional<number>;
  declare playerName: string;
  declare jsonInput: string;
  declare csvOutput: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Result.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playerName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    jsonInput: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    csvOutput: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "results",
    timestamps: true,
  }
);

export default Result;
