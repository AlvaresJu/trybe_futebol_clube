import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import TeamsModel from './TeamsModel';

class MatchesModel extends Model {
  declare id: number;
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
    field: 'home_team',
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
    field: 'home_team_goals',
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
    field: 'away_team',
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
    field: 'away_team_goals',
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
    field: 'in_progress',
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamsModel.hasMany(MatchesModel, {
  foreignKey: 'homeTeam',
  as: 'homeTeamMatches',
});
TeamsModel.hasMany(MatchesModel, {
  foreignKey: 'awayTeam',
  as: 'awayTeamMatches',
});

MatchesModel.belongsTo(TeamsModel, {
  foreignKey: 'homeTeam',
  as: 'teamHome',
});
MatchesModel.belongsTo(TeamsModel, {
  foreignKey: 'awayTeam',
  as: 'teamAway',
});

export default MatchesModel;
