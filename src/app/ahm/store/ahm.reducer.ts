import {AhmState, initialAhmState} from './ahm.state';
import {ADD_CRITERIA, AhmAction} from './ahm.actions';
import {CHANGE_RELEVANCE} from './criterion-relevance.actions';
import {SimpleMap} from '../models/simple-map';
import {PairwiseRelevance} from '../models/pairwise-relevance';

export function ahmReducer(state: AhmState = initialAhmState, action: AhmAction): AhmState {
  switch (action.type) {
    case ADD_CRITERIA:
      const newRelevanceMap = state.criterion
        .reduce((map, criteria) => (map[criteria.name] = generateRelevancePair(criteria.name, action.name), map), {});
      return {
        ...state,
        criterion: [
          ...state.criterion,
          {name: action.name}
        ],
        criterionRelevance: {
          ...Object.entries(state.criterionRelevance).reduce((map, [name, relevanceMap]) => (map[name] = {
            ...relevanceMap,
            [action.name]: newRelevanceMap[name]
          }, map), {}),
          [action.name]: newRelevanceMap
        }
      };
    case CHANGE_RELEVANCE:
      return {
        ...state,
        criterionRelevance: replaceRelevance(state.criterionRelevance, action.name1, action.name2, action.relevance)
      };
    default:
      return state;
  }
}

function generateRelevancePair(name1: string, name2: string, relevance: number = 1) {
  return function (name: string) {
    return name === name1 ? relevance : 1. / relevance;
  };
}

function replaceRelevance(state: SimpleMap<PairwiseRelevance>, name1: string, name2: string, relevance: number) {
  const newRelevance = generateRelevancePair(name1, name2, relevance);
  return {
    ...state,
    [name1]: {
      ...state[name1],
      [name2]: newRelevance
    },
    [name2]: {
      ...state[name2],
      [name1]: newRelevance
    }
  };
}
