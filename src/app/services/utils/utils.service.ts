import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public convertFromMapToArrayValues<A,B>(map: Map<A, B>): B[] {
    const categoriesArr: B[] = Array.from(map.values());
    return categoriesArr;
  }
}
