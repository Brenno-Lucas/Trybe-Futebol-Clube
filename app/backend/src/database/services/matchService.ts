import MatchesModel, { AwayTeams, HomeTeams } from '../models/matchesModel';
import IFieldsMatch from '../../interfaces/MatchsI';

const createMatchInprogress = async (infos: IFieldsMatch) => {
  const info = { ...infos, inProgress: 1 };
  const result = await MatchesModel.create(info);
  return result;
};

const getAll = async () => {
  const result = await MatchesModel.findAll({ include: [
    { association: HomeTeams, attributes: { exclude: ['id'] } },
    { association: AwayTeams, attributes: { exclude: ['id'] } },
  ] });
  return result;
};

const getById = async (id: number) => {
  const result = await MatchesModel.findOne({ where: { id } });
  return result;
};

const getInProgress = async (inProgress: string) => {
  const test = inProgress === 'true' ? 1 : 0;
  const result = await MatchesModel.findAll({
    where: { inProgress: test },
    include: [
      { association: HomeTeams, attributes: { exclude: ['id'] } },
      { association: AwayTeams, attributes: { exclude: ['id'] } },
    ] });
  return result;
};

const updateProgress = async (id: number) => {
  await MatchesModel.update({ inProgress: 0 }, { where: { id } });
};

export default {
  createMatchInprogress,
  getAll,
  getById,
  getInProgress,
  updateProgress,
};
