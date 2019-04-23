import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent implements OnInit, AfterContentChecked {

  @Input()
  itemsTitle: string;
  @Input()
  items$: Observable<Item[]>;
  @Input()
  ranks$: Observable<Record<string, number>>;
  @Input()
  scores$: Observable<Record<string, number>>;
  ranking$: Observable<[string, number][]>;
  _form = this.formBuilder.group({
    name: ['', Validators.required]
  });
  _selectedItems: string[] = [];
  _refreshSlider = new EventEmitter();
  @Output()
  relevanceChange = new EventEmitter<[string, string, number, string | undefined]>();
  @Output()
  addItem = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
  }

  itemClick(name: string) {
    this._selectedItems.includes(name) ? this.deselect(name) : this.select(name);
  }

  select(name: string) {
    const [first, second] = this._selectedItems;
    if (!first) {
      this._selectedItems = [name];
    } else if (!second) {
      this._selectedItems = [first, name];
    } else {
      this._selectedItems = [second, name];
    }
  }

  deselect(name: string) {
    const [first, second] = this._selectedItems;
    if (second === name) {
      this._selectedItems = [first];
    } else if (second) {
      this._selectedItems = [second];
    } else {
      this._selectedItems = [];
    }
  }

  changeRelevance(a: string, b: string, relevance: number) {
    // if (relevance === 0) {
    //   this.relevanceChange.emit([a, b, 1]);
    // } else if (relevance < 0) {
    //   this.relevanceChange.emit([b, a, -relevance]);
    // } else {
    const anchor = this._selectedItems.length === 1 ? this._selectedItems[0] : undefined;
    if (!anchor || anchor === a) {
      this.relevanceChange.emit([a, b, relevance, anchor])
    } else {
      this.relevanceChange.emit([b, a, 1 / relevance, anchor]);
    }
    // }
  }

  getRelevance(a: string, b: string): Observable<number> {
    return this.ranks$.pipe(
      map(ranks => ranks[b] / ranks[a]),
      map((relevance: number) => (relevance >= .67 ? Math.round(relevance) : -Math.round(1 / relevance)) || 1),
      distinctUntilChanged()
    );
  }

  onSubmit() {
    this.addItem.emit(this._form.value.name);
    this._form.reset();
  }

  getSliderOptions(a: Item, b: Item) {
    return {
      floor: -10,
      ceil: 10,
      showTicks: true,
      stepsArray: [
        {value: -10, legend: 10},
        {value: -9, legend: 9},
        {value: -8, legend: 8},
        {value: -7, legend: 7},
        {value: -6, legend: 6},
        {value: -5, legend: 5},
        {value: -4, legend: 4},
        {value: -3, legend: 3},
        {value: -2, legend: 2},
        {value: 0, legend: 1},
        {value: 2, legend: 2},
        {value: 3, legend: 3},
        {value: 4, legend: 4},
        {value: 5, legend: 5},
        {value: 6, legend: 6},
        {value: 7, legend: 7},
        {value: 8, legend: 8},
        {value: 9, legend: 9},
        {value: 10, legend: 10},
      ]
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
