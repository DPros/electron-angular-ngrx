import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AddOption, ChangeOptionsRelevance } from '../../store/ahm.actions';
import { AhmStore } from '../../services/ahm-store.service';
import { defaultIfEmpty, filter, first, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AhmCalculationUtils } from '../../services/ahm-calculation.utils';
import { Option } from '../../models/option';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { collectToObject, Tuple } from '../../utils/utils';
import { Criteria } from '../../models/criteria';

@Component({
  selector: 'options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsListComponent implements OnInit {

  _options$: Observable<Option[]>;
  _criterion$: Observable<Criteria[]>;
  _ranks$: Observable<Record<string, number>>;
  _scores$: Observable<Record<string, number>>;
  _selectedCriteria = new BehaviorSubject<string>(undefined);

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder,
              private ahmCalculationUtils: AhmCalculationUtils) {
  }

  ngOnInit() {
    this._criterion$ = this.ahmStore.select$(({criterion}) => criterion).pipe(
      map(Object.values)
    );
    this._options$ = this.ahmStore.select$(({options}) => options).pipe(
      map(Object.values)
    );
    this._scores$ = this._selectedCriteria.pipe(
      switchMap(selectedCriteria => selectedCriteria
        ? this.ahmCalculationUtils.getOptionsScoresByCriteria(selectedCriteria)
        : this.ahmCalculationUtils.getOptionsScores()
      )
    );
  }

  changeRelevance([a, b, relevance, anchor]: [string, string, number, string | undefined]) {
    this._selectedCriteria.pipe(
      first()
    ).subscribe(selectedCriteria =>
      this.ahmStore.dispatch(new ChangeOptionsRelevance(selectedCriteria, a, b, relevance, anchor)));
  }

  addOption(name: string) {
    this.ahmStore.dispatch(new AddOption(name));
  }

  onCriteriaClick(criteria: string) {
    this._selectedCriteria.next(criteria);
    this._ranks$ = this.ahmStore.select$(({options}) => options).pipe(
      switchMap((options) => this._selectedCriteria.pipe(
        filter(Boolean),
        map(selectedCriteria => collectToObject(Object.values(options)
          .map(_ => <Tuple>[_.name, _.rank[selectedCriteria]]))
        ),
        defaultIfEmpty({})
        )
      )
    );
  }
}
