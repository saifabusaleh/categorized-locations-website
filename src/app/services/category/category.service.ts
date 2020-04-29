import { Category } from '@models/category';
import { CategoryResponse, CategoryStatusEnum } from '@models/category.response';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UtilsService } from '@services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Map<string, Category>;


  constructor(private localStorageService: LocalStorageService,
              private utilsService: UtilsService) {
    this.categories = new Map();
  }


  public getCategories(): Observable<CategoryResponse> {

    const categoriesMap: Map<string, Category> = this.localStorageService.getCategories();

    const categoriesArr = this.utilsService.convertFromMapToArrayValues(categoriesMap);
    const categoriesResponse = new CategoryResponse();
    categoriesResponse.categories = categoriesArr;
    return of(categoriesResponse);
  }

  public createCategory(category: Category): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this.categories = this.localStorageService.getCategories();
    const categoryToAdd: Category = this.categories.get(category.categoryName);
    if (categoryToAdd) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST;
      return of(categoriesResponse);
    }
    this.categories.set(category.categoryName, category);
    this.localStorageService.setCategories(this.categories);
    categoriesResponse.categories = this.utilsService.convertFromMapToArrayValues(this.categories);
    return of(categoriesResponse);
  }

  public getCategoryByName(catName: string): Observable<CategoryResponse> {
    this.categories = this.localStorageService.getCategories();
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
    this.categories = this.localStorageService.getCategories();
    const category: Category = this.categories.get(categoryName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    category.categoryName = newCategoryName;
    this.categories.set(newCategoryName, category); // add new
    this.categories.delete(categoryName); //remove old one
    this.localStorageService.setCategories(this.categories);
    categoriesResponse.categories = this.utilsService.convertFromMapToArrayValues(this.categories);
    return of(categoriesResponse);
  }

  public deleteCategory(categoryName: string): Observable<CategoryResponse> {
    const categoriesResponse = new CategoryResponse();
    this.categories = this.localStorageService.getCategories();
    if (!this.categories.delete(categoryName)) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND;
      return of(categoriesResponse);
    }
    this.localStorageService.setCategories(this.categories);
    categoriesResponse.categories = this.utilsService.convertFromMapToArrayValues(this.categories);
    return of(categoriesResponse);
  }
}
