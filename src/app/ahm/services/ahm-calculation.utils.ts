import { Injectable } from '@angular/core';
import { AhmStore } from './ahm-store.service';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { collectToObject, Tuple } from '../utils/utils';

@Injectable()
export class AhmCalculationUtils {
  constructor(private ahmStore: AhmStore) {
  }

  public getOptionsScoresByCriteria(criteria: string): Observable<Record<string, number>> {
    return this.ahmStore.select$(state => state.options).pipe(
      map(_ => Object.values(_)),
      map(_ => _.map(o => <Tuple<number>>[o.name, o.rank[criteria]])),
      map(_ => _.map(([name]) => <Tuple<number>>[name, this.calcItemScore(name, _)])),
      map(_ => collectToObject(_))
    );
  }

  public getOptionsScores(): Observable<Record<string, number>> {
    return this.getCriterionScores().pipe(
      switchMap(_ =>
        combineLatest(Object.entries(_).map(([n, r]) =>
            this.getOptionsScoresByCriteria(n).pipe(
              map(optionsScores => Object.entries(optionsScores)),
              map(optionsScoresArr => optionsScoresArr.map(([optionName, optionScore]) => <Tuple<number>>[optionName, optionScore * r]))
            )
          )
        ).pipe(
          map(scores => {
            for (let critI = 1; critI < scores.length; critI++) {
              for (let optI = 0; optI < scores[0].length; optI++) {
                scores[0][optI][1] += scores[critI][optI][1];
              }
            }
            return scores[0];
          })
        )
      ),
      map(_ => collectToObject(_))
    );
  }

  public getCriterionScores(): Observable<Record<string, number>> {
    return this.criterionToRanksTuples$().pipe(
      map(_ => _.map(([name]) => <Tuple<number>>[name, this.calcItemScore(name, _)])),
      map(_ => collectToObject(_))
    );
  }

  public getCriteriaScore(name: string): Observable<number> {
    return this.criterionToRanksTuples$().pipe(
      map(_ => this.calcItemScore(name, _))
    );
  }

  private criterionToRanksTuples$() {
    return this.ahmStore.select$(state => state.criterion).pipe(
      map(Object.values),
      map(criterion => criterion.map(_ => <Tuple<number>>[_.name, _.rank]))
    );
  }

  private calcItemScore(name: string, ranks: [string, number][]) {
    return ranks.find(([n]) => n === name)[1] / ranks.reduce((acc, [, r]) => acc + r, 0);
  }

// getCriteriaScore(criteriaName: string): Observable<number> {
//   return this.criterionScores$.pipe(
//     log('criteria relevance sums'),
//     map(([criterionRelevanceMap, sums]: [Record<string, RelevanceMap>, Record<string, number>]) =>
//       this.doGetItemsScores(criteriaName, criterionRelevanceMap[criteriaName], sums)
//     )
//   );
// }
}
