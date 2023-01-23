import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class TeamsModel extends Model {
  declare id: number;
  declare teamName: string;
}

TeamsModel.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false },
  teamName: {
    type: STRING,
    allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default TeamsModel;
