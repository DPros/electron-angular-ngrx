import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder} from '@angular/forms';
import {AddOption, ChangeOptionsRelevance} from '../../store/ahm.actions';
import {AhmStore} from '../../services/ahm-store.service';
import {RelevanceMap} from '../../models/relevance-map';
import {first, map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {Option} from '../../models/option';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

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
  _scores$: Observable<Record<string, number>>;
  _selectedCriteria = new BehaviorSubject<Criteria>(null);

  ngOnInit() {
    this._criterion$ = this.ahmStore.select(({criterion}) => criterion);
    this._options$ = this.ahmStore.select(({options}) => options);
    this._scores$ = this._selectedCriteria.pipe(
      switchMap(selectedCriteria => selectedCriteria
        ? this.ahmCalculationUtils.getOptionByCriteriaScores$(selectedCriteria.name)
        : this.ahmCalculationUtils.getOptionsScore$()
      )
    );
  }

  changeRelevance([a, b, relevance]: [{ name: string }, { name: string }, number]) {
    this._selectedCriteria.pipe(
      first()
    ).subscribe(selectedCriteria => this.ahmStore.dispatch(new ChangeOptionsRelevance(selectedCriteria.name, a.name, b.name, relevance)));
  }

  addOption(name: string) {
    this.ahmStore.dispatch(new AddOption(name));
  }

  onCriteriaClick(criteria: Criteria) {
    this._selectedCriteria.next(criteria);
    if (!criteria) {
      this._relevances$ = null;
    } else if (!this._relevances$) {
      this._relevances$ = this.ahmStore.select(({optionsRelevances}) => optionsRelevances).pipe(
        switchMap((optionRelevances) => this._selectedCriteria.pipe(
          map(selectedCriteria => optionRelevances[selectedCriteria.name])
          )
        )
      );
    }
  }
}
