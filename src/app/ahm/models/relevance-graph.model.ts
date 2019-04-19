import {RelevanceMap} from "./relevance-map";
import {collectToObject, Tuple} from "../utils/utils";
import {PairwiseRelevance} from "./pairwise-relevance";

export class RelevanceGraph {
  constructor(private graph: Record<string, RelevanceMap> = {}) {
  }

  get(name: string) {
    return this.graph[name];
  }

  add(name: string) {
    const n = new RelevanceMap(collectToObject(Object.keys(this.graph).map(_ => <Tuple>[_, new PairwiseRelevance(_, name)])));
    Object.values(this.graph).forEach(_ => _.add(name, n[name]));
  }

  changeRelevance(a: string, b: string, relevance: number) {
    const old = this.graph[a].get(b);
    if (align(old, relevance)) {
      const diff = relevance / old;
      Object.keys(this.graph).forEach(key => {
        if (key === a) {
          this.graph[key].set(b, relevance);
        } else if (key !== b) {
          const a2key = this.graph[a].get(key);
          const key2b = this.graph[key].get(b);
          if (align(a2key, key2b)) {
            // A -> B, A -> K -> B
            const sqrtDiff = Math.sqrt(diff);
            this.graph[a].set(key, sqrtDiff * a2key);
            this.graph[key].set(b, sqrtDiff * key2b);
          } else if (align(old, a2key)) {
            //  A -> B -> C, A -> C
            this.graph[a].set(key, 1. / key2b * relevance)
          } else {
            //  C -> A -> B, C -> B
            this.graph[key].set(b, 1. / a2key * relevance)
          }
        }
      });
    } else {

    }
  }
}

function align(a: number, b: number) {
  return a === 1 || b === 1 || a < 1 && b < 1 || a > 1 && b > 1;
}

function greater(a: number, b: number) {
  if (b === 1) {
    return true;
  }
  if (a === 1) {
    return false;
  }
  const a1 = a < 0 ? 1 / a : a;
  const b1 = b < 0 ? 1 / b : b;
  return a1 > b1;
}
