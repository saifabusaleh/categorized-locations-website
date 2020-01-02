import { CategoryResponse, CategoryStatusEnum } from '../../model/category.response';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Category } from '../../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private _categories: Category[];
  private categoriesSubject: Subject<Category[]>;


  constructor(private localStorageService: LocalStorageService) {
    this._categories = [];
    this.categoriesSubject = new Subject<Category[]>();
  }

  get categories() {
    return this._categories;
  }
  set categories(value: Category[]) {
    this._categories = value;
    this.categoriesSubject.next(this._categories);
  }

  public getCategories(): Observable<CategoryResponse> {

    const categories: Category[] = this.localStorageService.getCategories();
    const categoriesResponse = new CategoryResponse();
    this.categories = categories;
    categoriesResponse.categories = this.categories;
    return of(categoriesResponse);
  }

  public createCategory(category: Category): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    const isCategoryExist: Category = this.categories.find((cat: Category) =>
      cat.categoryName === category.categoryName
    );
    if (isCategoryExist) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST;
      return of(categoriesResponse);
    }
    this.categories.push(category);
    this.localStorageService.setCategories(this.categories);
    return of(categoriesResponse);
  }

  public getCategoryByName(catName: string): Observable<CategoryResponse> {
    if (!this.categories || this.categories.length === 0) {
      // Handle the case when we are in refresh mode and the categories list is destroyed
      this.categories = this.localStorageService.getCategories();
    }
    const categoriesResponse = new CategoryResponse();
    const category: Category = this.categories.find((cat: Category) =>
      cat.categoryName === catName
    );
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
    } else {
      categoriesResponse.categories = [category];
    }
    return of(categoriesResponse);
  }

  public updateCategoryName(categoryName: string, newCategoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    const categoryIndex: number = this.categories.findIndex((cat: Category) =>
      cat.categoryName === categoryName
    );
    if (categoryIndex === -1) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this.categories[categoryIndex].categoryName = newCategoryName;
    this.localStorageService.setCategories(this.categories);
    return of(categoriesResponse);
  }

  public deleteCategory(categoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    const categoryIndex: number = this.categories.findIndex((cat: Category) =>
      cat.categoryName === categoryName
    );
    if (categoryIndex === -1) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this.categories.splice(categoryIndex, 1); // return value is deleted items or item
    this.localStorageService.setCategories(this.categories);
    return of(categoriesResponse);
  }

  public getCategoriesObservable(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }
}
