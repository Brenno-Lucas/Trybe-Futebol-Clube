import TeamsModel from '../models/teamsModel';

const getAll = async () => {
  const result = await TeamsModel.findAll();
  return result;
};

const getById = async (id: number) => {
  const result = await TeamsModel.findOne({ where: { id } });
  return result;
};

export default {
  getAll,
  getById,
};
