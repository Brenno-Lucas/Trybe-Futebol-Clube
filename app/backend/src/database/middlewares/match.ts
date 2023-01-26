import { NextFunction, Request, Response } from 'express';
import IFieldsMatch from '../../interfaces/MatchsI';
import teamService from '../services/teamService';

const isSameTeams = (teamHome: number, teamAway: number) => {
  if (teamHome === teamAway) {
    return {
      ok: false,
      status: 422,
      message: 'It is not possible to create a match with two equal teams',
    };
  }
  return { ok: true };
};

const validTeamId = async (team: number) => {
  const result = await teamService.getById(team);
  if (!result) return { ok: false, status: 404, message: 'There is no team with such id!' };
  return { ok: true };
};

const validTeamsId = async (teamHome: number, teamAway: number) => {
  const homeResult = await validTeamId(teamHome);
  if (!homeResult.ok) return { ok: false, status: homeResult.status, message: homeResult.message };
  const awayResult = await validTeamId(teamAway);
  if (!awayResult.ok) return { ok: false, status: awayResult.status, message: awayResult.message };
  return { ok: true };
};

const validTeamsGoals = (goalsHome: number, goalsAway: number) => {
  if (goalsHome < 0 || goalsAway < 0) {
    return {
      ok: false,
      status: 400,
      message: 'goals não pode ser negativo.',
    };
  }
  return { ok: true };
};

const validFields = async (fields: IFieldsMatch) => {
  const TeamId = await validTeamsId(fields.homeTeamId, fields.homeTeamId);
  if (!TeamId.ok) {
    return {
      ok: false,
      status: TeamId.status,
      message: TeamId.message,
    };
  }
  const TeamsGoals = validTeamsGoals(fields.homeTeamGoals, fields.awayTeamGoals);
  if (!TeamsGoals.ok) {
    return {
      ok: false,
      status: TeamsGoals.status,
      message: TeamsGoals.message,
    };
  }
  return { ok: true };
};

const validMatch = async (req: Request, res: Response, next: NextFunction) => {
  const fields = await validFields(req.body);
  if (!fields.ok) return res.status(fields.status as number).json({ message: fields.message });
  const { homeTeamId, awayTeamId } = req.body;
  const sameTeams = isSameTeams(homeTeamId, awayTeamId);
  if (!sameTeams.ok) {
    return res.status(sameTeams.status as number).json({ message: sameTeams.message });
  }
  return next();
};

export default validMatch;
