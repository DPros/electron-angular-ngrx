import {Injectable} from '@angular/core';
import {AhmState} from '../store/ahm.state';

@Injectable({providedIn: "root"})
export class AhmStore {

  constructor(public ahmState: AhmState = new AhmState()) {
  }
}
