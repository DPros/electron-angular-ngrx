import {AhmState, initialAhmState} from './ahm.state';
import {ADD_CRITERIA, ADD_OPTION, AhmAction, CHANGE_CRITERION_RELEVANCE, CHANGE_OPTIONS_RELEVANCE} from './ahm.actions';
import {collectToObject, Tuple} from "../utils/utils";
import {Criteria} from "../models/criteria";

export function ahmReducer(state: AhmState = initialAhmState, action: AhmAction): AhmState {
  switch (action.type) {
    case ADD_CRITERIA:
      return {
        ...state,
        criterion: {
          ...state.criterion,
          [action.name]: {name: action.name, rank: calcAvgRank(Object.values(state.criterion).map(_ => _.rank))}
        },
        options: collectToObject(Object.values(state.options).map(_ => <Tuple>[_.name, {
          ..._,
          rank: {
            ..._.rank,
            [action.name]: 1
          }
        }]))
      };

    case ADD_OPTION:
      return {
        ...state,
        options: {
          ...state.options,
          [action.name]: {
            name: action.name,
            rank: collectToObject(Object.keys(state.criterion).map(criteria => <Tuple>[criteria,
              calcAvgRank(Object.values(state.options).map(_ => _.rank[criteria]))]))
          }
        }
      };

    case CHANGE_OPTIONS_RELEVANCE:
      const newRanksByCriteria = (action.proportionally ? calcRanksProportionally : calcRanksRelatively)
      (action.name1, action.name2, action.relevance,
        collectToObject(Object.values(state.options).map(_ => <Tuple>[_.name, _.rank[action.criteria]])));
      return {
        ...state,
        options: collectToObject(Object.values(state.options).map(_ => <Tuple>[_.name, {
          ..._,
          rank: {
            ..._.rank,
            [action.criteria]: newRanksByCriteria[_.name]
          }
        }]))
      };

    case CHANGE_CRITERION_RELEVANCE:
      if (action.anchor) {
        let newRank: number, newAnchorRank: number;
        if (action.relevance < 1) {
          newRank = state.criterion[action.name1].rank / action.relevance;
          if (newRank > 10) {
            newAnchorRank = 10 * action.relevance;
            newRank = 10;
          } else if (newRank < 1) {
            newAnchorRank = 1 / action.relevance;
            newRank = 1;
          }
        } else {
          newRank = state.criterion[action.name1].rank / action.relevance;
          if (newRank > 10) {
            newAnchorRank = 10 / action.relevance;
            newRank = 10;
          } else if (newRank < 1) {
            newAnchorRank = action.relevance;
            newRank = 1;
          }
        }
        const res = Object.values(state.criterion).map(_ => <Tuple<Criteria>>[_.name,
          _.name === action.name2
            ? {
              ..._,
              rank: newRank
            }
            : (_.name === action.anchor && newAnchorRank)
            ? {
              ..._,
              rank: newAnchorRank
            }
            : _]);
        return {
          ...state,
          criterion: collectToObject(res)
        };
      } else {
        const newRanks = calcRanksRelatively(action.name1, action.name2, action.relevance, collectToObject(Object.values(state.criterion)
          .map(_ => <Tuple>[_.name, _.rank])));
        return {
          ...state,
          criterion: collectToObject(Object.values(state.criterion).map(_ => <Tuple>[_.name, {
            ..._,
            rank: newRanks[_.name]
          }]))
        }
      }

    default:
      return state;
  }
}

function calcAvgRank(ranks: number[]) {
  return ranks.reduce((acc, v) => acc + v, 0) / ranks.length || 1;
}

function calcRank(anchor: string, name1: string, name2: string, relevance: number, rankGetter: (name: string) => number) {
  return anchor === name1
    ? rankGetter(anchor) / relevance
    : rankGetter(anchor) * relevance;
}

function calcRanksProportionally(a: string, b: string, relevance: number, ranks: Record<string, number>) {
  const aOld = ranks[a];
  const bOld = ranks[b];
  let high: string, low: string, highRank: number, lowRank: number;
  if (aOld < bOld) {
    low = a;
    high = b;
    lowRank = aOld;
    highRank = bOld;
  } else {
    low = b;
    high = a;
    lowRank = bOld;
    highRank = aOld;
  }
  const highNew = relevance / lowRank;
  return collectToObject(Object.entries(ranks).map(([k, v]) => <Tuple<number>>[k, k === high
    ? highNew
    : v <= lowRank
      ? v
      : highNew * v / highRank
  ]))
}

function calcRanksRelatively(a: string, b: string, relevance: number, ranks: Record<string, number>) {
  const aOld = ranks[a];
  const bOld = ranks[b];
  const oldCenter = (aOld + bOld) / 2;
  let aNew = 2 * oldCenter / (relevance + 1);
  if (aNew < 1) {
    aNew = 1;
  }
  let bNew = aNew * relevance;
  if (bNew > 10) {
    bNew = 10;
    aNew = 10 / relevance;
  }
  let res = Object.entries(ranks)
    .map(([k, v]) => <Tuple>([k, k === b
      ? aNew
      : k === a
        ? bNew
        : v]));
  const minRank = Math.min(...res.map(([, _]) => _));
  if (minRank > 1) {
    res = res.map(([n, c]) => <Tuple>[n, c / minRank])
  }
  return collectToObject(res);
}
