import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {AhmStore} from '../services/ahm-store.service';

@Injectable()
export class AhmEffects {
  constructor(private actions$: Actions,
              private ahmStore: AhmStore) {
  }
}
