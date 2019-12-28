import { LocalStorageService } from '../local-storage/local-storage.service';
import { TestBed, inject } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { Category } from '../../model/category';
import { Observable } from 'rxjs';
import { CategoryResponse, CategoryStatusEnum } from '../../model/category.response';


let categories: Category[] = [];

describe('CategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    categories = [];
    categories.push(new Category('cat1'));
    categories.push(new Category('cat2'));
    categories.push(new Category('cat3'));
  });

  it('should be created', () => {
    const service: CategoryService = TestBed.get(CategoryService);
    expect(service).toBeTruthy();
  });

  describe('getCategories', () => {
    it('should call localStorageService.getCategories()', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          const getCategoriesResponse$: Observable<CategoryResponse> = catService.getCategories();
          expect(localStorageService.getCategories).toHaveBeenCalled();
          getCategoriesResponse$.subscribe((response: CategoryResponse) => {
            expect(response.categories).toEqual(categories);
            done();
          });
        })();
    });
  });

  describe('createCategory', () => {
    it('should add category if it doesnt already exist', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          const newCategory = new Category('New');
          const createCategoryResponse$: Observable<CategoryResponse> = catService.createCategory(newCategory);
          expect(localStorageService.getCategories).toHaveBeenCalled();
          createCategoryResponse$.subscribe((response: CategoryResponse) => {
            expect(response.categories.length).toEqual(4);
            done();
          });
        })();
    });

    it('should not add category if it is already exist', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          const createCategoryResponse$: Observable<CategoryResponse> = catService.createCategory(categories[0]);
          expect(localStorageService.getCategories).toHaveBeenCalled();
          createCategoryResponse$.subscribe((response: CategoryResponse) => {
            expect(response.status).toEqual(CategoryStatusEnum.CATEGORY_ALREADY_EXIST);
            done();
          });
        })();
    });
  });

  describe('getCategoryByName', () => {
    it('should return exisiting category', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          const getCategoriesResponse$: Observable<CategoryResponse> = catService.getCategoryByName(categories[0].getCategoryName());
          expect(localStorageService.getCategories).toHaveBeenCalled();
          getCategoriesResponse$.subscribe((response: CategoryResponse) => {
            expect(response.categories).toEqual([categories[0]]);
            done();
          });
        })();
    });

    it('should return CATEGORY_NOT_FOUND when category not found', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          const catNameThatDoesntExist = 'not_Found';
          const getCategoriesResponse$: Observable<CategoryResponse> = catService.getCategoryByName(catNameThatDoesntExist);
          expect(localStorageService.getCategories).toHaveBeenCalled();
          getCategoriesResponse$.subscribe((response: CategoryResponse) => {
            expect(response.status).toEqual(CategoryStatusEnum.CATEGORY_NOT_FOUND);
            done();
          });
        })();
    });
  });

  describe('deleteCategory', () => {
    it('should do nothing and return CATEGORY_NOT_FOUND if category doesnt exist', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          spyOn(localStorageService, 'setCategories');
          const catThatDoesntExist = new Category('not_Found');
          const deleteCategoriesResponse$: Observable<CategoryResponse> = catService.deleteCategory(catThatDoesntExist);
          expect(localStorageService.getCategories).toHaveBeenCalled();
          expect(localStorageService.setCategories).not.toHaveBeenCalled();
          deleteCategoriesResponse$.subscribe((response: CategoryResponse) => {
            expect(response.status).toEqual(CategoryStatusEnum.CATEGORY_NOT_FOUND);
            done();
          });
        })();
    });

    it('should remove category if category exist', function (done) {
      inject(
        [CategoryService, LocalStorageService],
        (catService: CategoryService, localStorageService: LocalStorageService) => {
          spyOn(localStorageService, 'getCategories').and.returnValue(categories);
          spyOn(localStorageService, 'setCategories');
          const secondCat: Category = categories[1];
          const thirdCat: Category = categories[2];
          const getCategoriesResponse$: Observable<CategoryResponse> = catService.deleteCategory(categories[0]);
          expect(localStorageService.getCategories).toHaveBeenCalled();
          expect(localStorageService.setCategories).toHaveBeenCalledWith([secondCat, thirdCat]);
          getCategoriesResponse$.subscribe((response: CategoryResponse) => {
            expect(response.categories).toEqual([secondCat, thirdCat]);
            done();
          });
        })();
    });
  });
});