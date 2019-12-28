import { CategoryResponse, CategoryStatusEnum } from '../../model/category.response';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Category } from '../../model/category';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesSubject: Subject<Category[]>;
  constructor(private localStorageService: LocalStorageService) {
    this.categoriesSubject = new Subject<Category[]>();

  }

  public getCategories(): Observable<CategoryResponse> {

    const categories: Category[] = this.localStorageService.getCategories();
    const categoriesResponse = new CategoryResponse();
    categoriesResponse.categories = categories;
    return of(categoriesResponse);
  }

  public createCategory(category: Category): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    let categories: Category[] = this.localStorageService.getCategories();
    if (!categories) {
      categories = [];
    }
    const isCategoryExist: Category = categories.find((cat: Category) =>
      cat.getCategoryName() === category.getCategoryName()
    );
    if (isCategoryExist) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST;
      return of(categoriesResponse);
    }
    categories.push(category);
    this.localStorageService.setCategories(categories);
    categoriesResponse.categories = categories;
    this.categoriesSubject.next(categories);
    return of(categoriesResponse);
  }

  public getCategoryByName(catName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    const categories: Category[] = this.localStorageService.getCategories();
    const category: Category = categories.find((cat: Category) =>
      cat.getCategoryName() === catName
    );
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
    } else {
      categoriesResponse.categories = [category];
    }
    return of(categoriesResponse);
  }

  public updateCategory(category: Category, newCategoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    let categories: Category[] = this.localStorageService.getCategories();
    if (!categories) {
      categories = [];
    }
    const categoryIndex: number = categories.findIndex((cat: Category) =>
      cat.getCategoryName() === category.getCategoryName()
    );
    if (categoryIndex === -1) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }

    categories[categoryIndex].setCategoryName(newCategoryName);
    this.localStorageService.setCategories(categories);
    categoriesResponse.categories = categories;
    this.categoriesSubject.next(categories);
    return of(categoriesResponse);
  }

  public deleteCategory(category: Category): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    let categories: Category[] = this.localStorageService.getCategories();
    if (!categories) {
      categories = [];
    }
    const categoryIndex: number = categories.findIndex((cat: Category) =>
      cat.getCategoryName() === category.getCategoryName()
    );
    if (categoryIndex === -1) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    categories.splice(categoryIndex, 1); // return value is deleted items or item
    this.localStorageService.setCategories(categories);
    categoriesResponse.categories = categories;
    this.categoriesSubject.next(categories);
    return of(categoriesResponse);
  }

  getCategoriesObservable(): Observable<any> {
    return this.categoriesSubject.asObservable();
  }

}
