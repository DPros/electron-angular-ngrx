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

export function collectToObject<T>(entries: [string, T][]): Record<string, T> {
  return entries.reduce((acc, [prop, value]) => (acc[prop] = value, acc), {});
}

export type Tuple = [string, any];
