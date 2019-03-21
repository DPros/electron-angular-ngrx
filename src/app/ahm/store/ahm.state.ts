import {Criteria} from '../models/criteria';
import {RelevanceMap} from '../models/relevance-map';
import {Option} from '../models/option';

export interface AhmState {
  criterion: Criteria[];
  criterionRelevance: Record<string, RelevanceMap>;
  options: Option[];
  optionsRelevances: Record<string, Record<string, RelevanceMap>>;
}

export const initialAhmState: AhmState = {
  criterion: [],
  options: [],
  criterionRelevance: {},
  optionsRelevances: {}
};

