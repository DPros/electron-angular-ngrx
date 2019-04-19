import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder} from '@angular/forms';
import {AhmStore} from '../../services/ahm-store.service';
import {RelevanceMap} from '../../models/relevance-map';
import {Observable} from 'rxjs/internal/Observable';
// import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {AhmState} from "../../store/ahm.state";

@Component({
  selector: 'criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.less']
})
export class CriterionListComponent implements OnInit {

  _state: AhmState;
  _criterion$: Observable<Criteria[]>;
  _relevances$: Observable<Record<string, RelevanceMap>>;
  _scores$: Observable<Record<string, number>>;

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this._state = this.ahmStore.ahmState;
  }

  changeRelevance([a, b, relevance]: [Criteria, Criteria, number]) {
    this._state.setCriterionRelevance(a.name, b.name, relevance);
  }

  addCriteria(name: string) {
    this._state.addCriteria(name);
  }
}
