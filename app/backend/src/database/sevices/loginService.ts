import LoginI from '../../interfaces/LoginI';
import UsersModel from '../models/usersModel';

const login = async (infos: LoginI) => {
  const { email } = infos;
  const result = await UsersModel.findOne({ where: { email } });
  return result;
};

const getRole = async (id: number) => {
  const result = await UsersModel.findOne({ where: { id } });
  return result;
};

export default {
  login,
  getRole,
};
