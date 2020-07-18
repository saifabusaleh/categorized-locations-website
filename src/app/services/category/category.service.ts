import { Category, CategoryResponse, CategoryStatusEnum } from '@models/category';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { UtilsService } from '@services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Map<string, Category>;


  constructor(
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService) {
    this.categories = new Map();
    this.categories = this.localStorageService.getCategories();
  }


  public getCategories(): CategoryResponse {
    const categoriesArr = this.utilsService.convertFromMapToArrayValues(this.categories);
    const categoriesResponse = new CategoryResponse();
    categoriesResponse.categories = categoriesArr;
    return categoriesResponse;
  }

  public createCategory(category: Category): CategoryResponse {
    const categoriesResponse = new CategoryResponse();
    const categoryToAdd: Category = this.categories.get(category.categoryName);
    if (categoryToAdd) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_ALREADY_EXIST.replace('{0}', category.categoryName);
      return categoriesResponse;
    }
    this.categories.set(category.categoryName, category);
    this.localStorageService.setCategories(this.categories);
    categoriesResponse.categories = this.utilsService.convertFromMapToArrayValues(this.categories);
    return categoriesResponse;
  }

  public getCategoryByName(catName: string): CategoryResponse {
    const categoriesResponse = new CategoryResponse();
    const category: Category = this.categories.get(catName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND.replace('{0}', catName);
    } else {
      categoriesResponse.categories = [category];
    }
    return categoriesResponse;
  }

  public updateCategoryName(categoryName: string, newCategoryName: string): CategoryResponse {
    const categoriesResponse = new CategoryResponse();
    const category: Category = this.categories.get(categoryName);
    if (!category) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND.replace('{0}', categoryName);
      return categoriesResponse;
    }
    category.categoryName = newCategoryName;
    this.categories.set(newCategoryName, category); // add new
    this.categories.delete(categoryName); // remove old one
    this.localStorageService.setCategories(this.categories);
    categoriesResponse.categories = this.utilsService.convertFromMapToArrayValues(this.categories);
    return categoriesResponse;
  }

  public deleteCategory(categoryName: string): CategoryResponse {
    const categoriesResponse = new CategoryResponse();
    if (!this.categories.delete(categoryName)) {
      categoriesResponse.status = CategoryStatusEnum.CATEGORY_NOT_FOUND.replace('{0}', categoryName);
      return categoriesResponse;
    }
    this.localStorageService.setCategories(this.categories);
    categoriesResponse.categories = this.utilsService.convertFromMapToArrayValues(this.categories);
    return categoriesResponse;
  }
}
