import {Criteria} from '../models/criteria';
import {Option} from '../models/option';
import {RelevanceGraph} from "../models/relevance-graph.model";

export class AhmState {
  constructor(private _criterion: Criteria[] = [],
              private _options: Option[] = [],
              private _criterionRelevance: RelevanceGraph = new RelevanceGraph(),
              private _optionsRelevances: Record<string, RelevanceGraph> = {}) {
  }


  get criterion(): Criteria[] {
    return this._criterion;
  }

  get options(): Option[] {
    return this._options;
  }

  get criterionRelevance() {
    return this._criterionRelevance;
  }

  get optionsRelevances() {
    return this._optionsRelevances;
  }

  addCriteria(name: string) {
    this.criterion.push({name});
    this.criterionRelevance.add(name);
  }

  addOption(name: string) {
    this.options.push({name, properties: {}});
    Object.values(this.optionsRelevances).forEach(_ => _.add(name))
  }

  setCriterionRelevance(name1: string, name2: string, relevance: number) {
    this.criterionRelevance.changeRelevance(name1, name2, relevance);
  }

  setOptionsRelevanceByCriteria(criteria: string, name1: string, name2: string, relevance: number) {
  }
}
