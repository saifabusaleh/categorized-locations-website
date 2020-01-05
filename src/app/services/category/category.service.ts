import { Category } from './../../model/category';
import { CategoryResponse, CategoryStatusEnum } from '../../model/category.response';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categories: Map<string, Category>;


  constructor(private localStorageService: LocalStorageService) {
    this._categories = new Map();
  }

  public convertFromMapToArrayValues(map: Map<string, Category>): Category[] {
    let categoriesArr: Category[] = [];
    for (const [key, value] of map.entries()) {
      categoriesArr.push(value);
    }
    return categoriesArr;
  }
  public getCategories(): Observable<CategoryResponse> {

    const categoriesMap: Map<string, Category> = this.localStorageService.getCategories();

    const categoriesArr = this.convertFromMapToArrayValues(categoriesMap);
    const categoriesResponse = new CategoryResponse();
    categoriesResponse.categories = categoriesArr;
    return of(categoriesResponse);
  }

  public createCategory(category: Category): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this._categories = this.localStorageService.getCategories();
    const categoryToAdd: Category = this._categories.get(category.categoryName);
    if (categoryToAdd) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST;
      return of(categoriesResponse);
    }
    this._categories.set(category.categoryName, category);
    this.localStorageService.setCategories(this._categories);
    categoriesResponse.categories = this.convertFromMapToArrayValues(this._categories);
    return of(categoriesResponse);
  }

  public getCategoryByName(catName: string): Observable<CategoryResponse> {
    // if (!this._categories || this._categories.size === 0) {
    //   // Handle the case when we are in refresh mode and the categories list is destroyed
    //   this._categories = this.localStorageService.getCategories();
    // }
    this._categories = this.localStorageService.getCategories();
    const categoriesResponse = new CategoryResponse();
    const category: Category = this._categories.get(catName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
    } else {
      categoriesResponse.categories = [category];
    }
    return of(categoriesResponse);
  }

  public updateCategoryName(categoryName: string, newCategoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this._categories = this.localStorageService.getCategories();
    const category: Category = this._categories.get(categoryName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    category.categoryName = newCategoryName;
    this._categories.set(newCategoryName, category); // add new
    this._categories.delete(categoryName); //remove old one
    this.localStorageService.setCategories(this._categories);
    categoriesResponse.categories = this.convertFromMapToArrayValues(this._categories);
    return of(categoriesResponse);
  }

  public deleteCategory(categoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this._categories = this.localStorageService.getCategories();
    if (!this._categories.delete(categoryName)) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this.localStorageService.setCategories(this._categories);
    categoriesResponse.categories = this.convertFromMapToArrayValues(this._categories);
    return of(categoriesResponse);
  }
}
