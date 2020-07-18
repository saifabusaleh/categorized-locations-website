import { Category } from '@models/category';
import { Coordinate, AppLocation } from '@models/location';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly CATEGORIES_LOCAL_STORAGE_KEY = 'categories';
  private readonly LOCATIONS_LOCAL_STORAGE_KEY = 'locations';
  constructor() {
    //
  }

  public setCategories(value): void {
    localStorage[this.CATEGORIES_LOCAL_STORAGE_KEY] = JSON.stringify(Array.from(value.entries()));
  }


  public getCategories(): Map<string, Category> {
    return new Map(JSON.parse(localStorage.getItem(this.CATEGORIES_LOCAL_STORAGE_KEY)));
  }

  public setLocations(value): void {
    localStorage[this.LOCATIONS_LOCAL_STORAGE_KEY] = JSON.stringify(Array.from(value.entries()));
  }

  public getLocations(): Map<string, AppLocation> {
    return new Map(JSON.parse(localStorage.getItem(this.LOCATIONS_LOCAL_STORAGE_KEY)));
  }
}
