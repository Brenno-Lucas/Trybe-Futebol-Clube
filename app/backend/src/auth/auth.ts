import { Request } from 'express';
import 'dotenv/config';
import { verify } from 'jsonwebtoken';
import PayloadI from '../interfaces/PayloadI';

const secret = process.env.JWT_SECRET || 'secret';

const validToken = (req: Request): PayloadI => {
  try {
    const token = req.header('Authorization');
    if (!token) return { ok: true };
    const result = verify(token, secret);
    return result as PayloadI;
  } catch (error) {
    return { ok: true, message: 'Token must be a valid token' };
  }
};
export default validToken;
