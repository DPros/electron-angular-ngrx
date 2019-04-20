import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {FormBuilder, Validators} from '@angular/forms';
import {RelevanceGraph} from "../../models/relevance-graph.model";

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericListComponent implements OnInit, AfterContentChecked {

  @Input()
  items: Item[];
  @Input()
  relevances: RelevanceGraph;
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

  constructor(private formBuilder: FormBuilder) {
  }

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
    // if (relevance === 0) {
    //   this.relevanceChange.emit([a, b, 1]);
    // } else if (relevance < 0) {
    //   this.relevanceChange.emit([b, a, -relevance]);
    // } else {
      this.relevanceChange.emit([a, b, relevance]);
    // }
  }

  getRelevance(a: Criteria, b: Criteria): number {
    const v = this.relevances.get(a.name).get(b.name);
    return v >= 1 ? Math.round(v) : -Math.round(1 / v);
  }

  onSubmit() {
    this.addItem.emit(this._form.value.name);
    this._form.reset();
  }

  getSliderOptions(a: Criteria, b: Criteria) {
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
