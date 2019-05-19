import { AhmState, initialAhmState } from './ahm.state';
import { ADD_CRITERIA, ADD_OPTION, AhmAction, CHANGE_CRITERION_RELEVANCE, CHANGE_OPTIONS_RELEVANCE } from './ahm.actions';
import { collectToObject, Tuple } from '../utils/utils';
import { Criteria } from '../models/criteria';
import { Option } from '../models/option';

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
      let ranksByCriteria;
      if (action.anchor) {
        ranksByCriteria = calcRanks(action.anchor, action.name1, action.name2, action.relevance,
          (option: Option) => option.rank[action.criteria], state.options);

      } else {
        ranksByCriteria = calcRanksRelatively(action.name1, action.name2, action.relevance, collectToObject(Object.values(state.options)
          .map(_ => <Tuple>[_.name, _.rank[action.criteria]])));
      }
      return {
        ...state,
        options: collectToObject(ranksByCriteria.map(([n, r]) => {
          const option = state.options[n];
          return <Tuple<Option>>[n, {...option, rank: {...option.rank, [action.criteria]: r}}];
        }))
      };

    case CHANGE_CRITERION_RELEVANCE:
      let ranks;
      if (action.anchor) {
        ranks = calcRanks(action.anchor, action.name1, action.name2, action.relevance,
          (criteria: Criteria) => criteria.rank, state.criterion);

      } else {
        ranks = calcRanksRelatively(action.name1, action.name2, action.relevance, collectToObject(Object.values(state.criterion)
          .map(_ => <Tuple>[_.name, _.rank])));
      }
      return {
        ...state,
        criterion: collectToObject(ranks.map(([n, r]) => <Tuple<Criteria>>[n, {...state.criterion[n], rank: r}]))
      };

    default:
      return state;
  }
}

function calcAvgRank(ranks: number[]) {
  return ranks.reduce((acc, v) => acc + v, 0) / ranks.length || 5;
}

function calcRanks<T extends { name: string }>(anchor: string, name1: string, name2: string, relevance: number,
                                               getRank: (item: T) => number,
                                               items: Record<string, Readonly<T>>) {
  let res: [string, number][];
  const newRank = getRank(items[name1]) / relevance;
  if (newRank > 9) {
    const diff = 9. / newRank;
    res = Object.values(items).map(_ => <Tuple<number>>[_.name,
      _.name === name2
        ? 9
        : getRank(_) * diff
    ]);
    if (!!res.find(([, _]) => _ < 1)) {
      res = res.map(([n, r]) => <Tuple<number>>[n, n === name2 || n === name1 ? r : 1 + (getRank(items[n]) - 1) * diff]);
    }
  } else if (newRank < 1) {
    const diff = newRank;
    res = Object.values(items).map(_ => <Tuple<number>>[_.name,
      _.name === name2
        ? 1
        : getRank(_) / diff
    ]);
    if (!!res.find(([, _]) => _ > 9)) {
      res = res.map(([n, r]) => <Tuple<number>>[n, n === name2 || n === name1 ? r : getRank(items[n]) + (9 - getRank(items[n])) * diff]);
    }
  } else {
    res = Object.values(items).map(_ => <Tuple<number>>[_.name,
      _.name === name2
        ? newRank
        : getRank(_)]);
  }
  return res;
}

function calcRanksRelatively(a: string, b: string, relevance: number, ranks: Record<string, number>) {
  const aOld = ranks[a];
  const bOld = ranks[b];
  const x = Math.sqrt(relevance * bOld / aOld);
  let aNew = aOld * x;
  if (aNew < 1) {
    aNew = 1;
  }
  let bNew = bOld / x;
  if (bNew > 9) {
    bNew = 9;
    aNew = 9 / relevance;
  }
  return Object.entries(ranks)
    .map(([k, v]) => <Tuple>([k, k === b
      ? bNew
      : k === a
        ? aNew
        : v]));
}
