import { Injectable } from '@angular/core';
import { AhmStore } from './ahm-store.service';
import {filter, map, switchMap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { collectToObject, Tuple } from '../utils/utils';
import { Option } from '../models/option';

@Injectable()
export class AhmCalculationUtils {
  constructor(private ahmStore: AhmStore) {
  }

  public getOptionsScoresByCriteria$(criteria: string): Observable<Record<string, number>> {
    return this.ahmStore.select$(state => state.options).pipe(
      map(_ => this.getOptionsScoresByCriteria(criteria, Object.values(_)))
    );
  }

  public getOptionsScoresByCriteria(criteria: string, options: Option[]): Record<string, number> {
    const tuples = options
      .map(o => <Tuple<number>>[o.name, o.rank[criteria]]);
    return collectToObject(tuples.map(([name]) => <Tuple<number>>[name, this.calcItemScore(name, tuples)]));
  }

  public getOptionsScores(): Observable<Record<string, number>> {
    return this.getCriterionScores().pipe(
      switchMap(criterionScores => this.ahmStore.select$(state => state.options).pipe(
        map(_ => Object.values(_)),
        map(options => Object.entries(criterionScores).map(([n, r]) =>
            Object.entries(this.getOptionsScoresByCriteria(n, options))
              .map(([optionName, optionScore]) => <Tuple<number>>[optionName, optionScore * r])
          )
        ))
      ),
      map(scores => {
        for (let critI = 1; critI < scores.length; critI++) {
          for (let optI = 0; optI < scores[0].length; optI++) {
            scores[0][optI][1] += scores[critI][optI][1];
          }
        }
        return scores[0];
      }),
      filter(_ => Boolean(_)),
      map(_ => collectToObject(_))
    );
  }

  public getCriterionScores(): Observable<Record<string, number>> {
    return this.criterionToRanksTuples$().pipe(
      map(_ => _.map(([name]) => <Tuple<number>>[name, this.calcItemScore(name, _)])),
      map(_ => collectToObject(_))
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
}
