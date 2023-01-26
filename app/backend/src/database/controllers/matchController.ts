import { NextFunction, Request, Response } from 'express';
import matchService from '../services/matchService';
import validToken from '../../auth/auth';

const getAll = async (req: Request, res:Response) => {
  try {
    const result = await matchService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getInProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inProgress } = req.query;
    if (!inProgress) return next();
    const result = await matchService.getInProgress(inProgress as unknown as string);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const createMatchInprogress = async (req: Request, res: Response) => {
  try {
    const user = validToken(req);
    if (user.ok) return res.status(401).json({ message: user.message });
    const result = await matchService.createMatchInprogress(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updateProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await matchService.updateProgress(Number(id));
    return res.status(200).json({ message: 'Finished' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default {
  getAll,
  getInProgress,
  createMatchInprogress,
  updateProgress,
};
