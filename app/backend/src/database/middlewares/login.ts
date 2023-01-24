import { NextFunction, Request, Response } from 'express';
import ValidReturnI from '../../interfaces/ValidateReturnI';

type testNme = { password: string, email: string };

const validEmail = (email: string): ValidReturnI => {
  const re = /[a-z0-9._%+!$&*=^|~#%'`?{}/-]+@([a-z0-9-]+\.){1,}([a-z]{2,16})/;
  if (!re.test(email)) {
    return {
      ok: false,
      status: 401,
      message: 'Incorrect email or password',
    };
  }
  return { ok: true };
};

const validFieldsEmail = (info: testNme): ValidReturnI => {
  if (!(Object.keys(info).includes('email') && info.email.length !== 0)) {
    return {
      ok: false,
      status: 400,
      message: 'All fields must be filled',
    };
  }
  return { ok: true };
};

const validPassword = (password: string): ValidReturnI => {
  if (password.length < 6) {
    return {
      ok: false,
      status: 401,
      message: 'Incorrect email or password',
    };
  }
  return { ok: true };
};

const validFieldsPassword = (info: testNme): ValidReturnI => {
  if (!(Object.keys(info).includes('password') && info.password.length !== 0)) {
    return {
      ok: false,
      status: 400,
      message: 'All fields must be filled',
    };
  }
  return { ok: true };
};

const validFields = (info: testNme): ValidReturnI => {
  const email = validFieldsEmail(info);
  if (!email.ok) return { ok: false, status: email.status, message: email.message };
  const password = validFieldsPassword(info);
  if (!password.ok) return { ok: false, status: password.status, message: password.message };
  return { ok: true, message: `${email.message}, ${password.message}` };
};

const validLogin = (req: Request, res: Response, next: NextFunction) => {
  const info = req.body;
  const fields = validFields(info);
  if (!fields.ok) {
    return res.status(fields.status as number).json({ message: fields.message });
  }
  const email = validEmail(info.email);
  if (!email.ok) {
    return res.status(email.status as number).json({ message: email.message });
  }
  const password = validPassword(info.password);
  if (!password.ok) {
    return res.status(password.status as number).json({ message: password.message });
  }
  next();
};

export default validLogin;
