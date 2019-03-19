import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {Subscription} from 'rxjs/internal/Subscription';
import {FormBuilder, Validators} from '@angular/forms';
import {AddCriteria} from '../../store/ahm.actions';
import {AhmStore} from '../../services/ahm-store.service';
import {ChangeRelevance} from '../../store/criterion-relevance.actions';
import {SimpleMap} from '../../models/simple-map';
import {PairwiseRelevance} from '../../models/pairwise-relevance';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {AhmCalculationUtils} from '../../services/ahm-calculation.utils';
import {log} from '../../utils/utils';

@Component({
  selector: 'criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CriterionListComponent implements OnInit, OnDestroy {

  constructor(private ahmStore: AhmStore,
              private formBuilder: FormBuilder,
              private ahmCalculationUtils: AhmCalculationUtils) {
  }

  _criterion: Observable<Criteria[]>;
  relevances$: Observable<SimpleMap<PairwiseRelevance>>;
  _criteriaForm = this.formBuilder.group({
    name: ['', Validators.required]
  });
  _selectedCriteria: Criteria[] = [];

  private subscriptions: Subscription;

  ngOnInit() {
    this._criterion = this.ahmStore.select(({criterion}) => criterion);
    this.relevances$ = this.ahmStore.select(({criterionRelevance}) => criterionRelevance);
  }

  select(criteria: Criteria) {
    const [first, second] = this._selectedCriteria;
    if (!first) {
      this._selectedCriteria = [criteria];
    } else if (!second) {
      this._selectedCriteria = [first, criteria];
    } else {
      this._selectedCriteria = [second, criteria];
    }
  }

  deselect(criteria: Criteria) {
    const [first, second] = this._selectedCriteria;
    if (second === criteria) {
      this._selectedCriteria = [first];
    } else if (second) {
      this._selectedCriteria = [second];
    } else {
      this._selectedCriteria = [];
    }
  }

  changeRelevance(a: Criteria, b: Criteria, relevance: number) {
    if (relevance === 0) {
      this.ahmStore.dispatch(new ChangeRelevance(b.name, a.name, 1));
    } else if (relevance < 0) {
      this.ahmStore.dispatch(new ChangeRelevance(b.name, a.name, -relevance));
    } else {
      this.ahmStore.dispatch(new ChangeRelevance(a.name, b.name, relevance));
    }
  }

  getRelevance(a: Criteria, b: Criteria): Observable<number> {
    return this.relevances$.pipe(
      log('criterion list relevances'),
      map(relevances => relevances[a.name][b.name](a.name)),
      log('final relevance'),
      map((relevance: number) => relevance === 1 ? 0 : relevance < 1 ? -1. / relevance : relevance),
      distinctUntilChanged()
    );
  }

  getTotalRelevance(name: string) {
    return this.ahmCalculationUtils.getCriteriaTotalRelevance(name);
  }

  onSubmit() {
    this.ahmStore.dispatch(new AddCriteria(this._criteriaForm.value.name));
  }

  getSliderOptions(a: Criteria, b: Criteria) {
    return {
      floor: -10,
      ceil: 10,
      showTicks: true
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
