import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AddCriteria, ChangeCriterionRelevance} from '../../store/ahm.actions';
import {AhmStore} from '../../services/ahm-store.service';
import {Observable} from 'rxjs/internal/Observable';
import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {map} from 'rxjs/operators';
import {collectToObject, Tuple} from "../../utils/utils";
import {Criteria} from "../../models/criteria";

@Component({
  selector: 'criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CriterionListComponent implements OnInit {

  _criterion$: Observable<Criteria[]>;
  _ranks$: Observable<Record<string, number>>;
  _scores$: Observable<Record<string, number>>;

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder,
              private ahmCalculationUtils: AhmCalculationUtils) {
  }

  ngOnInit() {
    this._criterion$ = this.ahmStore.select(({criterion}) => criterion).pipe(
      map(Object.values)
    );
    this._ranks$ = this._criterion$.pipe(
      map(_ => {
        console.log(_);
        return collectToObject(_.map(_ => <Tuple>[_.name, _.rank]))
      })
    );
    // this._scores$ = this.ahmCalculationUtils.getCriterionScores$().pipe(tap(_ => console.log(_)));
  }

  changeRelevance([a, b, relevance, anchor]: [string, string, number, string | undefined]) {
    this.ahmStore.dispatch(new ChangeCriterionRelevance(a, b, relevance, anchor));
  }

  addCriteria(name: string) {
    this.ahmStore.dispatch(new AddCriteria(name));
  }
}
