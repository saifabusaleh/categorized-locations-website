import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { Category } from '../../model/category';

let store = {};
const mockLocalStorage = {
  getItem: (key: string): string => {
    return key in store ? store[key] : null;
  },
  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  }
};

describe('LocalStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  let categories: Category[] = [];
  beforeEach(() => {
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    categories.push(new Category('cat1'));
    categories.push(new Category('cat2'));
    categories.push(new Category('cat3'));
  });

  afterEach(() => {
    store = {};
  });

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });

  describe('setCategories', () => {
    it('should set the correct values in local storage', inject([LocalStorageService], (localStorageService: LocalStorageService) => {

      localStorageService.setCategories(categories);
      expect((store as any).categories).toEqual(JSON.stringify(categories));
    }));
  });


  describe('getCategories', () => {
    it('should return the correct value', inject([LocalStorageService], (localStorageService: LocalStorageService) => {

      localStorageService.setCategories(categories);
      expect(localStorageService.getCategories()).toEqual(categories);
    }));
  });
  
});
