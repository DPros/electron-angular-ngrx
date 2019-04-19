// import {Injectable} from '@angular/core';
// import {AhmStore} from './ahm-store.service';
// import {map, pluck, shareReplay} from 'rxjs/operators';
// import {combineLatest, Observable} from 'rxjs';
// import {collectToObject, Tuple} from '../utils/utils';
// import {RelevanceMap} from '../models/relevance-map';
// import {log} from '../utils/utils';
//
// @Injectable()
// export class AhmCalculationUtils {
//   constructor(private ahmStore: AhmStore) {
//     this.criterionScores$ = this.ahmStore.select(({criterionRelevance}) => criterionRelevance).pipe(
//       map(_ => this.doGetScores(_)),
//       shareReplay(1)
//     );
//     this.getCriterionScores$().subscribe();
//
//     this.optionsByCriteriaScores$ = this.ahmStore.select(({criterion, optionsRelevances}) => ({criterion, optionsRelevances})).pipe(
//       map(({criterion, optionsRelevances}) => collectToObject(criterion.map(({name}) => <Tuple>[
//         name,
//         this.doGetScores(optionsRelevances[name])
//       ]))),
//       log("options by criteria"),
//       shareReplay(1)
//     );
//     this.optionsByCriteriaScores$.subscribe();
//   }
//
//   private readonly criterionScores$: Observable<Record<string, number>>;
//   private readonly optionsByCriteriaScores$: Observable<Record<string, Record<string, number>>>;
//
//   private doGetScores(itemsRelevanceMap: Record<string, RelevanceMap>) {
//     const sums = Object.entries(itemsRelevanceMap).map(([name, relevanceMap]: [string, RelevanceMap]) => [
//       name,
//       Object.values(relevanceMap).map(_ => _(name)).reduce((sum, v) => sum + v, 1)
//     ]).reduce((acc: Record<string, number>, [name, relevanceSum]: [string, number]) => (acc[name] = relevanceSum, acc), {});
//     return collectToObject(Object.keys(itemsRelevanceMap).map(criteriaName => <Tuple>[
//       criteriaName,
//       this.doGetItemScore(criteriaName, itemsRelevanceMap[criteriaName], sums)
//     ]));
//   }
//
//   getCriterionScores$(): Observable<Record<string, number>> {
//     return this.criterionScores$;
//   }
//
//   getOptionByCriteriaScores$(criteria: string) {
//     return this.optionsByCriteriaScores$.pipe(
//       pluck(criteria)
//     );
//   }
//
//   getOptionsScore$() {
//     return combineLatest(
//       this.ahmStore.select(state => state.options),
//       this.criterionScores$,
//       this.optionsByCriteriaScores$
//     ).pipe(
//       log('options total scores input'),
//       map(([options, criterionScores, optionsByCriteriaScores]) => collectToObject(options.map(({name}) => <Tuple>[
//           name,
//           Object.entries(criterionScores)
//             .map(([criteriaName, criteriaValue]) => optionsByCriteriaScores[criteriaName][name] * criteriaValue)
//             .reduce((acc, v) => acc + v, 0)
//         ])
//       )),
//       log('option total')
//     );
//   }
//
//   private doGetItemScore(itemName: string, relevanceMap: RelevanceMap, sums: Record<string, number>) {
//     return [...Object.entries(relevanceMap)
//       .map(([name, pairwiseRelevance]) => pairwiseRelevance(name) / sums[name]),
//       1 / sums[itemName]
//     ].reduce((acc, v) => acc + v, 0) / Object.keys(sums).length;
//   }
//
//   // getCriteriaScore(criteriaName: string): Observable<number> {
//   //   return this.criterionScores$.pipe(
//   //     log('criteria relevance sums'),
//   //     map(([criterionRelevanceMap, sums]: [Record<string, RelevanceMap>, Record<string, number>]) =>
//   //       this.doGetItemScore(criteriaName, criterionRelevanceMap[criteriaName], sums)
//   //     )
//   //   );
//   // }
// }
