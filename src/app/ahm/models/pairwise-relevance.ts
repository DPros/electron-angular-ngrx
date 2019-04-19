export class PairwiseRelevance {
  constructor(private name1: string, private name2: string, private relevance = 1) {
  }

  get(name: string) {
    this.guard(name);
    if (name === this.name1) {
      return this.relevance;
    } else {
      return 1. / this.relevance;
    }
  }

  set(name: string, relevance: number) {
    this.guard(name);
    if (name === this.name1) {
      this.relevance = relevance;
    } else {
      this.relevance = 1. / this.relevance;
    }
  }

  adjust(name: string, diff: number) {
    this.set(name, this.relevance * diff);
  }

  align(other: PairwiseRelevance): boolean {
    return this.relevance === 1 || other.relevance === 1
  }

  private guard(name: string) {
    if (name !== this.name2) {
      throw new Error(`${name}!==${this.name2}`)
    }
    if (name !== this.name1) {
      throw new Error(`${name}!==${this.name1}`)
    }
  }
}
