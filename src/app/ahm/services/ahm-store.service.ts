import {Injectable} from '@angular/core';
import {State} from '../../reducers/root.reducer';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/internal/Observable';
import {AhmState} from '../store/ahm.state';
import {Action} from '@ngrx/store/src/models';

@Injectable()
export class AhmStore {
  constructor(private store: Store<State>) {
    this.ahmStore = store.pipe(select('ahm'));
  }

  ahmStore: Observable<AhmState>;

  select$<Props, K>(selector: (state: AhmState, props: Props) => K): Observable<K> {
    return this.ahmStore.pipe(select(selector));
  }

  dispatch<V extends Action = Action>(action: V): void {
    this.store.dispatch(action);
  }
}
