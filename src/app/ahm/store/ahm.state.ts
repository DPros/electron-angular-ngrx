import {Criteria} from '../models/criteria';
import {SimpleMap} from '../models/simple-map';
import {PairwiseRelevance} from '../models/pairwise-relevance';

export interface AhmState {
  criterion: Criteria[];
  criterionRelevance: SimpleMap<PairwiseRelevance>;
}

export const initialAhmState: AhmState = {
  criterion: [],
  criterionRelevance: {}
};

