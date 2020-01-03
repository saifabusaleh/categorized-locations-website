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
  private categoriesSubject: Subject<Map<string, Category>>;


  constructor(private localStorageService: LocalStorageService) {
    this._categories = new Map();
    this.categoriesSubject = new Subject<Map<string, Category>>();
  }

  get categories() {
    return this._categories;
  }
  set categories(value: Map<string, Category>) {
    this._categories = value;
    this.categoriesSubject.next(this._categories);
  }

  private convertFromMapToArrayValues(map: Map<string, Category>): Category[] {
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
    const categoryToAdd: Category = this.categories.get(category.categoryName);
    if (categoryToAdd) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST;
      return of(categoriesResponse);
    }
    this.categories.set(category.categoryName, category);
    this.localStorageService.setCategories(this.categories);
    return of(categoriesResponse);
  }

  public getCategoryByName(catName: string): Observable<CategoryResponse> {
    if (!this.categories || this.categories.size === 0) {
      // Handle the case when we are in refresh mode and the categories list is destroyed
      this.categories = this.localStorageService.getCategories();
    }
    const categoriesResponse = new CategoryResponse();
    const category: Category = this.categories.get(catName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
    } else {
      categoriesResponse.categories = [category];
    }
    return of(categoriesResponse);
  }

  public updateCategoryName(categoryName: string, newCategoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    const category: Category = this.categories.get(categoryName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this.categories.set(newCategoryName, category); // add new
    this.categories.delete(categoryName); //remove old one
    this.localStorageService.setCategories(this.categories);
    return of(categoriesResponse);
  }

  public deleteCategory(categoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    if (!this.categories.delete(categoryName)) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this.localStorageService.setCategories(this.categories);
    return of(categoriesResponse);
  }

  public getCategoriesObservable(): Observable<Map<string, Category>> {
    return this.categoriesSubject.asObservable();
  }
}
