import { Request, Response } from 'express';
import leaderboardService from '../services/leaderboardService';

const getLeaderBoard = async (req: Request, res: Response) => {
  const result = await leaderboardService.getLeaderBoard();
  return res.status(200).json(result);
};

const getLeaderBoardHome = async (req: Request, res: Response) => {
  const result = await leaderboardService.getLeaderBoardHome();
  return res.status(200).json(result);
};

export default {
  getLeaderBoard,
  getLeaderBoardHome,
};
