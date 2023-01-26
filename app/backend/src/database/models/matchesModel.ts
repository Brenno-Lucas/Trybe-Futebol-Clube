import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import TeamsModel from './teamsModel';

class MatchesModel extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  homeTeamId: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

export const HomeTeams = MatchesModel
  .belongsTo(TeamsModel, {
    foreignKey: 'homeTeamId',
    as: 'homeTeam',
  });
export const AwayTeams = MatchesModel
  .belongsTo(TeamsModel, {
    foreignKey: 'awayTeamId',
    as: 'awayTeam',
  });

export default MatchesModel;
