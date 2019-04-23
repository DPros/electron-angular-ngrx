import {Action} from '@ngrx/store';

export const ADD_CRITERIA = '[AHM] add criteria';
export const ADD_OPTION = '[AHM] add option';
export const CHANGE_CRITERION_RELEVANCE = '[AHM] change criterion relevance';
export const CHANGE_OPTIONS_RELEVANCE = '[AHM] change options relevance';

export class ChangeCriterionRelevance implements Action {
  readonly type = CHANGE_CRITERION_RELEVANCE;

  constructor(public name1: string, public name2: string, public relevance: number, public anchor: string) {
  }
}

export class ChangeOptionsRelevance implements Action {
  readonly type = CHANGE_OPTIONS_RELEVANCE;

  constructor(public criteria: string, public name1: string, public name2: string, public relevance: number, public proportionally: boolean) {
  }
}

export class AddCriteria implements Action {
  readonly type = ADD_CRITERIA;

  constructor(public name: string) {
  }
}

export class AddOption implements Action {
  readonly type = ADD_OPTION;

  constructor(public name: string) {
  }
}

export type AhmAction = AddCriteria | AddOption | ChangeCriterionRelevance | ChangeOptionsRelevance;
