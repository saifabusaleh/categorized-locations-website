import { LocationResponse, LocationStatusEnum } from './../../model/location-response';
import { CategoryService } from 'src/app/services/category/category.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryResponse } from 'src/app/model/category.response';
import { AppLocation } from 'src/app/model/location';
import { Category } from 'src/app/model/category';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _categoryService: CategoryService,
    private localStorageService: LocalStorageService) {

  }

  public getLocations(): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    return this._categoryService.getCategories().pipe(map((response: CategoryResponse) => {
      const categories: Category[] = response.categories;
      let locations: AppLocation[] = [];
      if (categories) {
        categories.forEach((category: Category) => {
          if (category.locations) {
            category.locations.forEach((location: AppLocation) => {
              locations.push(location);
            });
          }
        });
      }
      locationResponse.locations = locations;
      return locationResponse;
    }));
  }

  public getLocation(locationName: string): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    return this._categoryService.getCategories().pipe(map((response: CategoryResponse) => {
      const categories: Category[] = response.categories;
      let locationRes: AppLocation;
      if (categories) {
        categories.forEach((category: Category) => {
          if (category.locations) {
            for (let location of category.locations) {
              if (location.name === locationName) {
                locationRes = location;
                break;
              }
            }
          }
        });
      }
      if (!locationRes) {
        locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
      }
      locationResponse.locations = [locationRes];
      return locationResponse;
    }));
  }

  public createLocation(location: AppLocation): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    const locationCategoryName = location.category;
    return this._categoryService.getCategories().pipe(map((response: CategoryResponse) => {
      const categories: Category[] = response.categories;
      if (categories) {

        const targetCategory: Category = categories.find((cat: Category) =>
          cat.categoryName === locationCategoryName
        );
        if (!targetCategory) {
          locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
          return locationResponse;
        }
        if (!targetCategory.locations) {
          targetCategory.locations = [];
        }
        targetCategory.locations.push(location);
      }
      this.localStorageService.setCategories(categories);
      this._categoryService.categories = categories;
      locationResponse.locations = [location];
      return locationResponse;
    }));
  }

  public updateLocation(locationName: string, locationCategoryName: string, newLocation: AppLocation): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    return this._categoryService.getCategories().pipe(map((response: CategoryResponse) => {
      const categories: Category[] = response.categories;
      let targetCategoryIndex: number;
      let targetCategory: Category;
      if (categories) {
        categories.every((cat: Category, i) => {
          if (cat.categoryName === locationCategoryName) {
            targetCategory = cat;
            targetCategoryIndex = i;
            return false; //break
          }
        });
        if (!targetCategory || !targetCategory.locations) {
          locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
          return locationResponse;
        }
        const locationToUpdateIndex = targetCategory.locations.findIndex((loc: AppLocation) =>
          loc.name === locationName
        );
        if (locationToUpdateIndex === -1) {
          locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
          return locationResponse;
        }
        targetCategory.locations[locationToUpdateIndex] = newLocation;
        categories[targetCategoryIndex] = targetCategory;
        this.localStorageService.setCategories(categories);
        return locationResponse;
      }
      locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
      return locationResponse;
    }));
  }

  public deleteLocation(locationName: string, locationCategoryName: string): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    return this._categoryService.getCategories().pipe(map((response: CategoryResponse) => {
      const categories: Category[] = response.categories;
      let targetCategoryIndex: number;
      let targetCategory: Category;
      if (categories) {
        categories.every((cat: Category, i) => {
          if (cat.categoryName === locationCategoryName) {
            targetCategory = cat;
            targetCategoryIndex = i;
            return false; //break
          }
        });
        if (!targetCategory || !targetCategory.locations) {
          locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
          return locationResponse;
        }
        const locationToDeleteIndex = targetCategory.locations.findIndex((loc: AppLocation) =>
          loc.name === locationName
        );
        if (locationToDeleteIndex === -1) {
          locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
          return locationResponse;
        }
        targetCategory.locations.splice(locationToDeleteIndex, 1);
        categories[targetCategoryIndex] = targetCategory;
        this.localStorageService.setCategories(categories);
        return locationResponse;
      }
      locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
      return locationResponse;
    }));
  }
}
