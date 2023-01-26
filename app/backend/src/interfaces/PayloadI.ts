import { JwtPayload } from 'jsonwebtoken';

export default interface PaylodI extends JwtPayload {
  id?: number;
  ok?: boolean
  message?: string;
}
