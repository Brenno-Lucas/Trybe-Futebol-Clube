import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import loginService from '../services/loginService';
import validtoken from '../../auth/auth';

const secret = process.env.JWT_SECRET || 'secret';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginService.login({ email });
  compare(password, result?.password as string, (err, resp) => {
    if (err) {
      return res.status(401).json({
        message: 'Incorrect email or password',
      });
    }
    if (resp) {
      const token = sign({ id: result?.id }, secret);
      return res.status(200).json({ token });
    }
    return res.status(401).json({
      message: 'Incorrect email or password',
    });
  });
};

const checkLogin = async (req: Request, res: Response) => {
  try {
    const token = validtoken(req);
    if (token.ok) return res.status(401).json({ message: 'não autorizado.' });
    const result = await loginService.getRole(Number(token.id));
    return res.status(200).json({ role: result?.role });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export {
  login,
  checkLogin,
};
