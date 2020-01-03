import { Category } from './../../model/category';
import { Coordinate } from 'src/app/model/location';
import { AppLocation } from './../../model/location';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly CATEGORIES_LOCAL_STORAGE_KEY = 'categories';
  constructor() {
    //
  }

  public setCategories(value): void {
    localStorage.categories = JSON.stringify(Array.from(value.entries()));
  }


  public getCategories(): Map<string, Category> {
    const categoriesMap: Map<string, Category> =  new Map(JSON.parse(localStorage.getItem(this.CATEGORIES_LOCAL_STORAGE_KEY)));



    return categoriesMap ? this.parseToCategoryType(categoriesMap) : undefined;
  }

  private parseToCategoryType(categoriesMap): Map<string, Category> { 
    let categoriesResult: Map<string, Category> = new Map<string, Category>();

    for (const [key, cat] of categoriesMap.entries()) {
      let catToAdd: Category = new Category(cat._categoryName);
      catToAdd.locations = [];
      if (cat._locations) {
        cat._locations.forEach((loc) => {
          const cords: Coordinate = new Coordinate(loc._coords._lat, loc._coords._lng);
          catToAdd.locations.push(new AppLocation(loc._name, loc._address,
            cords, cat._categoryName));
        });
      }
      categoriesResult.set(catToAdd.categoryName, catToAdd);
    }
    return categoriesResult;
  }
}
