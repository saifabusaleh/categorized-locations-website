import { Coordinate } from 'src/app/model/location';
import { AppLocation } from './../../model/location';
import { Category } from 'src/app/model/category';
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
    localStorage.setItem(this.CATEGORIES_LOCAL_STORAGE_KEY, JSON.stringify(value));
  }


  public getCategories(): Category[] {
    let categoriesObj =  JSON.parse(localStorage.getItem(this.CATEGORIES_LOCAL_STORAGE_KEY));
    

    return categoriesObj ? this.parseToCategoryType(categoriesObj) : [];
  }

  private parseToCategoryType(categoriesObj): Category[] { 
    let categoriesResult: Category[] = [];
    categoriesObj.forEach((cat) => {
      let catToAdd: Category = new Category(cat._categoryName);
      catToAdd.locations = [];
      if (cat._locations) {
        cat._locations.forEach((loc) => {
          const cords: Coordinate = new Coordinate(loc._coords._lat, loc._coords._lng);
          catToAdd.locations.push(new AppLocation(loc._name, loc._address,
            cords, cat._categoryName));
        });
      }
      categoriesResult.push(catToAdd);
    });
    return categoriesResult;
  }
}
