import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder} from '@angular/forms';
import {AhmStore} from '../../services/ahm-store.service';
import {RelevanceMap} from '../../models/relevance-map';
import {Observable} from 'rxjs';
// import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {Option} from '../../models/option';
import {AhmState} from "../../store/ahm.state";

@Component({
  selector: 'options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.less']
})
export class OptionsListComponent implements OnInit {

  _state: AhmState;
  _options$: Observable<Option[]>;
  _criterion$: Observable<Criteria[]>;
  _relevances: Record<string, RelevanceMap>;
  _scores$: Observable<Record<string, number>>;
  _selectedCriteria: Criteria;

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this._state = this.ahmStore.ahmState;
  }

  changeRelevance([a, b, relevance]: [{ name: string }, { name: string }, number]) {
    this._state.setOptionsRelevanceByCriteria(this._selectedCriteria.name, a.name, b.name, relevance);
  }

  addOption(name: string) {
    this._state.addOption(name);
  }

  onCriteriaClick(criteria: Criteria) {
    this._selectedCriteria = criteria;
    if (!criteria) {
      this._relevances = null;
    } else if (!this._relevances) {
      this._relevances = this._state[this._selectedCriteria.name];
    }
  }
}
