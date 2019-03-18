import {Action} from '@ngrx/store';

export const CHANGE_RELEVANCE = '[AHM] change relevance';

export class ChangeRelevance implements Action {
  readonly type = CHANGE_RELEVANCE;

  constructor(public name1: string, public name2: string, public relevance: number) {
  }
}

export type CriterionRelevanceAction = ChangeRelevance;
