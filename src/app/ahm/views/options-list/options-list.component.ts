import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder} from '@angular/forms';
import {AddOption, ChangeOptionsRelevance} from '../../store/ahm.actions';
import {AhmStore} from '../../services/ahm-store.service';
import {RelevanceMap} from '../../models/relevance-map';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {Option} from '../../models/option';

@Component({
  selector: 'options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsListComponent implements OnInit {

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder,
              private ahmCalculationUtils: AhmCalculationUtils) {
  }

  _options$: Observable<Option[]>;
  _criterion$: Observable<Criteria[]>;
  _relevances$: Observable<Record<string, RelevanceMap>>;
  _selectedCriteria: Criteria;
  _scores$: Observable<Record<string, number>>;

  ngOnInit() {
    this._criterion$ = this.ahmStore.select(({criterion}) => criterion);
    this._options$ = this.ahmStore.select(({options}) => options);
    this._scores$ = this.ahmCalculationUtils.getOptionsScore$();
    //   of().pipe(
    //   mapTo(this._selectedCriteria),
    //   log("selected criteria"),
    //   switchMap(selectedCriteria => selectedCriteria
    //     ? this.ahmCalculationUtils.getOptionByCriteriaScores$(selectedCriteria.name)
    //     : this.ahmCalculationUtils.getOptionsScore$()
    //   )
    // );
    this._scores$.subscribe(_ => console.log(_));
  }

  changeRelevance([a, b, relevance]: [{ name: string }, { name: string }, number]) {
    this.ahmStore.dispatch(new ChangeOptionsRelevance(this._selectedCriteria.name, a.name, b.name, relevance));
  }

  addOption(name: string) {
    this.ahmStore.dispatch(new AddOption(name));
  }

  onCriteriaClick(criteria: Criteria) {
    if (this._selectedCriteria === criteria) {
      this._selectedCriteria = null;
      this._relevances$ = null;
    } else {
      this._selectedCriteria = criteria;
      this._relevances$ = this.ahmStore.select(({optionsRelevances}) => optionsRelevances).pipe(
        map((optionRelevances) => optionRelevances[this._selectedCriteria.name])
      );
    }
  }
}
