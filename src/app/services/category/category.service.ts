import { Category } from '@models/category';
import { CategoryResponse, CategoryStatusEnum } from '@models/category.response';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { UtilsService } from '@services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categories: Map<string, Category>;


  constructor(private _localStorageService: LocalStorageService,
              private _utilsService: UtilsService) {
    this._categories = new Map();
  }


  public getCategories(): Observable<CategoryResponse> {

    const categoriesMap: Map<string, Category> = this._localStorageService.getCategories();

    const categoriesArr = this._utilsService.convertFromMapToArrayValues(categoriesMap);
    const categoriesResponse = new CategoryResponse();
    categoriesResponse.categories = categoriesArr;
    return of(categoriesResponse);
  }

  public createCategory(category: Category): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this._categories = this._localStorageService.getCategories();
    const categoryToAdd: Category = this._categories.get(category.categoryName);
    if (categoryToAdd) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST;
      return of(categoriesResponse);
    }
    this._categories.set(category.categoryName, category);
    this._localStorageService.setCategories(this._categories);
    categoriesResponse.categories = this._utilsService.convertFromMapToArrayValues(this._categories);
    return of(categoriesResponse);
  }

  public getCategoryByName(catName: string): Observable<CategoryResponse> {
    this._categories = this._localStorageService.getCategories();
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
    this._categories = this._localStorageService.getCategories();
    const category: Category = this._categories.get(categoryName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    category.categoryName = newCategoryName;
    this._categories.set(newCategoryName, category); // add new
    this._categories.delete(categoryName); //remove old one
    this._localStorageService.setCategories(this._categories);
    categoriesResponse.categories = this._utilsService.convertFromMapToArrayValues(this._categories);
    return of(categoriesResponse);
  }

  public deleteCategory(categoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this._categories = this._localStorageService.getCategories();
    if (!this._categories.delete(categoryName)) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this._localStorageService.setCategories(this._categories);
    categoriesResponse.categories = this._utilsService.convertFromMapToArrayValues(this._categories);
    return of(categoriesResponse);
  }
}
