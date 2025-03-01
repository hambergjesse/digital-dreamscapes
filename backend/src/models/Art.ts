import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface ArtAttributes {
  id: number;
  data: string;
  title: string;
  palette?: string;
  complexity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ArtCreationAttributes extends Optional<ArtAttributes, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'palette' | 'complexity'> {}

class Art extends Model<ArtAttributes, ArtCreationAttributes> implements ArtAttributes {
  public id!: number;
  public data!: string;
  public title!: string;
  public palette!: string;
  public complexity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Art.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    palette: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complexity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Art",
    tableName: "arts",
  }
);

export default Art;
