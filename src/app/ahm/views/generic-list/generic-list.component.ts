import {AfterContentChecked, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder, Validators} from '@angular/forms';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {RelevanceMap} from '../../models/relevance-map';

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent implements OnInit, AfterContentChecked {

  constructor(private formBuilder: FormBuilder) {
  }

  @Input()
  items: Item[];
  @Input()
  relevances: Record<string, RelevanceMap>;
  @Input()
  scores: Record<string, number>;

  ranking: [string, number][];

  _form = this.formBuilder.group({
    name: ['', Validators.required]
  });
  _selectedItems: Item[] = [];
  _refreshSlider = new EventEmitter();

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

  getRelevance(a: Criteria, b: Criteria): number {
    return this.relevances[a.name].get(b.name);
  }

  onSubmit() {
    this.addItem.emit(this._form.value.name);
    this._form.reset();
  }

  getSliderOptions(a: Criteria, b: Criteria) {
    return {
      floor: -10,
      ceil: 10,
      showTicks: true
    };
  }

  ngOnInit(): void {
    // this.ranking$ = this.scores$.pipe(
    //   map(scores => Object.entries(scores).sort(([, a], [, b]) => b - a))
    // );
  }

  ngAfterContentChecked(): void {
    this._refreshSlider.emit();
  }
}

interface Item {
  name: string;
}
