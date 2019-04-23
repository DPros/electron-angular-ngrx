import {Criteria} from '../models/criteria';
import {Option} from '../models/option';

export interface AhmState {
  criterion: Record<string, Criteria>;
  options: Record<string, Option>;
}

export const initialAhmState: AhmState = {
  criterion: {},
  options: {}
};

