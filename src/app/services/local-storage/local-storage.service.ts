import { Injectable } from '@angular/core';
import { Category } from '../../model/category';

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
      categoriesResult.push(new Category(cat._categoryName));
    });
    return categoriesResult;
  }
}
