import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder} from '@angular/forms';
import {AddCriteria, ChangeCriterionRelevance} from '../../store/ahm.actions';
import {AhmStore} from '../../services/ahm-store.service';
import {RelevanceMap} from '../../models/relevance-map';
import {Observable} from 'rxjs/internal/Observable';
import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CriterionListComponent implements OnInit {

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder,
              private ahmCalculationUtils: AhmCalculationUtils) {
  }

  _criterion$: Observable<Criteria[]>;
  _relevances$: Observable<Record<string, RelevanceMap>>;
  _scores$: Observable<Record<string, number>>;

  ngOnInit() {
    this._criterion$ = this.ahmStore.select(({criterion}) => criterion);
    this._relevances$ = this.ahmStore.select(({criterionRelevance}) => criterionRelevance);
    this._scores$ = this.ahmCalculationUtils.getCriterionScores$().pipe(tap(_ => console.log(_)));
  }

  changeRelevance([a, b, relevance]: [Criteria, Criteria, number]) {
    this.ahmStore.dispatch(new ChangeCriterionRelevance(a.name, b.name, relevance));
  }

  addCriteria(name: string) {
    this.ahmStore.dispatch(new AddCriteria(name));
  }
}
