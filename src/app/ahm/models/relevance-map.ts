import {PairwiseRelevance} from "./pairwise-relevance";

export class RelevanceMap {
  constructor(private map: Record<string, PairwiseRelevance> = {}) {
  }

  get(name: string) {
    return this.map[name].get(name);
  }

  set(name: string, relevance: number) {
    this.map[name].set(name, relevance);
  }

  adjust(name: string, diff: number) {
    this.map[name].adjust(name, diff);
  }

  add(name: string, relevance: PairwiseRelevance) {
    this.map[name] = relevance;
  }
}
