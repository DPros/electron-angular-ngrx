import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder, Validators} from '@angular/forms';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {RelevanceMap} from '../../models/relevance-map';
import {Options} from 'ng5-slider';

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
  }

  @Input()
  items$: Observable<Item[]>;
  @Input()
  relevances$: Observable<Record<string, RelevanceMap>>;
  @Input()
  scores$: Observable<Record<string, number>>;

  ranking$: Observable<[string, number][]>;

  _form = this.formBuilder.group({
    name: ['', Validators.required]
  });
  _selectedItems: Item[] = [];

  @Output()
  relevanceChange = new EventEmitter<[Item, Item, number]>();

  @Output()
  addItem = new EventEmitter<string>();

  itemClick(item: Item) {
    this._selectedItems.includes(item) ? this.deselect(item) : this.select(item);
  }

  select(item: Item) {
    const [first, second] = this._selectedItems;
    if (!first) {
      this._selectedItems = [item];
    } else if (!second) {
      this._selectedItems = [first, item];
    } else {
      this._selectedItems = [second, item];
    }
  }

  deselect(criteria: Criteria) {
    const [first, second] = this._selectedItems;
    if (second === criteria) {
      this._selectedItems = [first];
    } else if (second) {
      this._selectedItems = [second];
    } else {
      this._selectedItems = [];
    }
  }

  changeRelevance(a: Item, b: Item, relevance: number) {
    if (relevance === 0) {
      this.relevanceChange.emit([a, b, 1]);
    } else if (relevance < 0) {
      this.relevanceChange.emit([b, a, -relevance]);
    } else {
      this.relevanceChange.emit([a, b, relevance]);
    }
  }

  getRelevance(a: Criteria, b: Criteria): Observable<number> {
    return this.relevances$.pipe(
      map(relevances => relevances[a.name][b.name](a.name)),
      map((relevance: number) => relevance === 1 ? 0 : relevance < 1 ? -1. / relevance : relevance),
      distinctUntilChanged()
    );
  }

  onSubmit() {
    this.addItem.emit(this._form.value.name);
  }

  getSliderOptions(a: Criteria, b: Criteria) {
    return {
      floor: -10,
      ceil: 10,
      showTicks: true
    };
  }

  ngOnInit(): void {
    this.ranking$ = this.scores$.pipe(
      map(scores => Object.entries(scores).sort(([, a], [, b]) => a - b))
    );
  }
}

interface Item {
  name: string;
}
