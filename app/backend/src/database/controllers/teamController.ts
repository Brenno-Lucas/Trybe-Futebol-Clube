import { Request, Response } from 'express';
import teamService from '../services/teamService';

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await teamService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await teamService.getById(Number(id));
    if (Number(id) !== result?.id) throw new Error('Id não encontrado.');
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export {
  getAll,
  getById,
};
