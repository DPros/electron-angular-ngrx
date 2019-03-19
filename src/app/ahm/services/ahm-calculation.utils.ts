import {Injectable} from '@angular/core';
import {AhmStore} from './ahm-store.service';
import {filter, map, pluck, shareReplay, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SimpleMap} from '../models/simple-map';
import {log} from '../utils/utils';
import {PairwiseRelevance} from '../models/pairwise-relevance';

@Injectable()
export class AhmCalculationUtils {
  constructor(private ahmStore: AhmStore) {
    this.criteriaRelevanceSums$ = this.ahmStore.select(({criterionRelevance}) => criterionRelevance).pipe(
      map(Object.entries),
      log('criterion relevances'),
      map((entries: [string, PairwiseRelevance][]) =>
        entries.map(([name, relevanceMap]: [string, PairwiseRelevance]) => [
          name,
          Object.values(relevanceMap).map(_ => _(name)).reduce((sum, v) => sum + v, 1)
        ]).reduce((acc: SimpleMap<number>, [name, relevanceSum]: [string, number]) => (acc[name] = relevanceSum, acc), {})
      ),
      shareReplay()
    );
  }

  criteriaRelevanceSums$: Observable<SimpleMap<number>>;

  getCriteriaTotalRelevance(criteriaName: string): Observable<number> {
    return this.ahmStore.select(({criterionRelevance}) => criterionRelevance).pipe(
      pluck(criteriaName),
      log('criterion map for ' + criteriaName),
      switchMap((relevanceMap: PairwiseRelevance) => this.criteriaRelevanceSums$.pipe(
        log('criteria relevance sums'),
        map((sums: SimpleMap<number>) => [...Object.entries(relevanceMap)
          .map(([name, pairwiseRelevance]) => pairwiseRelevance(name) / sums[name]),
          1 / sums[criteriaName]
        ]),
        filter(divisions => divisions.every(_ => !isNaN(_))),
        log('divisions divided'),
        map((divisions: number[]) => {
          const a = divisions
            .reduce((acc, v) => acc + v, 0);
          const b = Object.keys(relevanceMap).length + 1;
          console.log(a + ' ' + b);
          return a / b;
        })
        )
      )
    );
  }
}
