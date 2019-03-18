import {Action} from '@ngrx/store';
import {CriterionRelevanceAction} from './criterion-relevance.actions';

export const ADD_CRITERIA = '[AHM] add criteria';

export class AddCriteria implements Action {
  readonly type = ADD_CRITERIA;

  constructor(public name: string) {
  }
}


export type AhmAction = AddCriteria | CriterionRelevanceAction;
