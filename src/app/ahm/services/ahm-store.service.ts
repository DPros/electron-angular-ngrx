import {Injectable} from '@angular/core';
import {AhmState} from '../store/ahm.state';

@Injectable({providedIn: "root"})
export class AhmStore {

  constructor() {
  }

  private _ahmState: AhmState = new AhmState();

  get ahmState() {
    return this._ahmState
  }

  set ahmState(ahmState: AhmState) {
    this._ahmState = ahmState;
  }
}
