import {CriterionRelevanceState, initialCriterionRelevance} from './criterion-relevance.state';
import {CHANGE_RELEVANCE, CriterionRelevanceAction} from './criterion-relevance.actions';
import {ADD_CRITERIA, AddCriteria} from './ahm.actions';
import {Criteria} from '../models/criteria';

export function criterionRelevanceReducer(state: CriterionRelevanceState = initialCriterionRelevance,
                                          action: CriterionRelevanceAction | AddCriteria):
  CriterionRelevanceState {
  switch (action.type) {
    case ADD_CRITERIA:
      return {...state, [action.name]: {}};
    default:
      return state;
  }
}

function setRelevance(state: CriterionRelevanceState, a: Criteria, aRelevance: number, b: Criteria, bRelevance: number) {
  return {
    ...state,
    [a.name]: {...state[a.name], [b.name]: aRelevance},
    [b.name]: {...state[b.name], [a.name]: bRelevance}
  };
}
