import ClassificationTable from '../tableUtils/classification';
import ClosedMatchsI from '../../interfaces/ClosedMatchsI';
import matchService from './matchService';
import TableHome from '../tableUtils/home';

const getLeaderBoard = async () => {
  const result = await matchService.getInProgress('false');
  const rating = new ClassificationTable();
  rating.handleMatches(result as unknown as ClosedMatchsI[]);
  const finalTable = rating.filterTable();
  return finalTable;
};

const getLeaderBoardHome = async () => {
  const result = await matchService.getInProgress('false');
  const rating = new TableHome();
  rating.handleMatches(result as unknown as ClosedMatchsI[]);
  const table = rating.filterTable();
  return table;
};

export default {
  getLeaderBoard,
  getLeaderBoardHome,
};
