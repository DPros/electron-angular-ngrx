import {MonoTypeOperatorFunction, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export function log<T>(message: string): MonoTypeOperatorFunction<T> {
  return function tapOperatorFunction(source: Observable<T>): Observable<T> {
    return source.pipe(tap(_ => {
      console.log(message);
      console.log(_);
    }));
  };
}
