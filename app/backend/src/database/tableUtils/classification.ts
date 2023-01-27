import TableI from '../../interfaces/TableI';
import ClosedMatchsI, { TeamID } from '../../interfaces/ClosedMatchsI';
import reset from './reset';

export default class ClassificationTable {
  readonly initialPoints = {
    1: { ...reset[1] },
    2: { ...reset[2] },
    3: { ...reset[3] },
    4: { ...reset[4] },
    5: { ...reset[5] },
    6: { ...reset[6] },
    7: { ...reset[7] },
    8: { ...reset[8] },
    9: { ...reset[9] },
    10: { ...reset[10] },
    11: { ...reset[11] },
    12: { ...reset[12] },
    13: { ...reset[13] },
    14: { ...reset[14] },
    15: { ...reset[15] },
    16: { ...reset[16] },
  };

  public classification = this.initialPoints;

  addVictory = (team: TeamID) => {
    this.classification[team].totalVictories += 1;
  };

  addDraw = (team: TeamID[]) => {
    this.classification[team[0]].totalDraws += 1;
    this.classification[team[1]].totalDraws += 1;
  };

  addLose = (team: TeamID) => {
    this.classification[team].totalLosses += 1;
  };

  addPoints = (
    team: TeamID[],
    goal: number[],
  ) => {
    if (goal[0] > goal[1]) {
      this.classification[team[0]].totalPoints += 3;
      this.addVictory(team[0]);
      this.addLose(team[1]);
      return;
    }
    if (goal[0] < goal[1]) {
      this.classification[team[1]].totalPoints += 3;
      this.addVictory(team[1]);
      this.addLose(team[0]);
      return;
    }
    this.classification[team[0]].totalPoints += 1;
    this.classification[team[1]].totalPoints += 1;
    this.addDraw(team);
  };

  addGames = (team: TeamID[]) => {
    this.classification[team[0]].totalGames += 1;
    this.classification[team[1]].totalGames += 1;
  };

  addGoalsOwn = (
    team: TeamID[],
    goal: number[],
  ) => {
    this.classification[team[1]].goalsOwn += goal[0];
    this.classification[team[0]].goalsOwn += goal[1];
  };

  addGoalsFavor = (
    teamHome: TeamID,
    teamAway: TeamID,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) => {
    this.classification[teamHome].goalsFavor += homeTeamGoals;
    this.classification[teamAway].goalsFavor += awayTeamGoals;
  };

  updateGoalsBalance = (team: TeamID) => {
    const { goalsFavor } = this.classification[team];
    const { goalsOwn } = this.classification[team];
    const balanceGoals = goalsFavor - goalsOwn;
    this.classification[team].goalsBalance = balanceGoals;
  };

  addEfficiency = (team: TeamID) => {
    const { totalGames } = this.classification[team];
    const { totalPoints } = this.classification[team];
    const efficiency = (totalPoints / (totalGames * 3)) * 100;
    this.classification[team].efficiency = Number.parseFloat(efficiency.toFixed(2));
  };

  handleMatches = (matches: ClosedMatchsI[]) => {
    matches.forEach(({ homeTeamGoals, awayTeamGoals, homeTeamId, awayTeamId }) => {
      this.addPoints([homeTeamId, awayTeamId], [homeTeamGoals, awayTeamGoals]);
      this.addGames([homeTeamId, awayTeamId]);
      this.addGoalsOwn([homeTeamId, awayTeamId], [homeTeamGoals, awayTeamGoals]);
      this.addGoalsFavor(homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals);
      this.updateGoalsBalance(homeTeamId);
      this.updateGoalsBalance(awayTeamId);
      this.addEfficiency(homeTeamId);
      this.addEfficiency(awayTeamId);
    });
  };

  compareGoalsOwn = (TableA: TableI, TableB: TableI) => TableA.goalsOwn - TableB.goalsOwn;

  compareGoalsFavor = (TableA: TableI, TableB: TableI) => {
    if (TableB.goalsFavor === TableA.goalsFavor) return false;
    return TableB.goalsFavor - TableA.goalsFavor;
  };

  compareGoalsBalance = (tableA: TableI, tableB: TableI) => {
    if (tableB.goalsBalance === tableA.goalsBalance) return false;
    return tableB.goalsBalance - tableA.goalsBalance;
  };

  compareVictory = (tableA: TableI, tableB: TableI) => {
    if (tableB.totalVictories === tableA.totalVictories) return false;
    return tableB.totalVictories - tableA.totalVictories;
  };

  handleDraw = (tableA: TableI, tableB: TableI) => {
    const victory = this.compareVictory(tableA, tableB);
    if (victory) return victory;
    const goalBalance = this.compareGoalsBalance(tableA, tableB);
    if (goalBalance) return goalBalance;
    const goalFavor = this.compareGoalsFavor(tableA, tableB);
    if (goalFavor) return goalFavor;
    const goalOwn = this.compareGoalsOwn(tableA, tableB);
    return goalOwn;
  };

  filterTable = () => {
    const table = Object.values(this.classification);
    const filter = table.sort((param1, param2) => {
      if (param2.totalPoints === param1.totalPoints) return this.handleDraw(param1, param2);
      return param2.totalPoints - param1.totalPoints;
    });
    return filter;
  };
}
