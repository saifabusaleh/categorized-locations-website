import { LocationResponse, LocationStatusEnum } from '@models/location-response';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppLocation } from '@models/location';
import { Category } from '@models/category';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { UtilsService } from '@services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private locations: AppLocation[];
  constructor(private utilsService: UtilsService,
              private localStorageService: LocalStorageService) {
    this.locations = [];

  }

  public getLocations(): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    const categories: Category[] = this.utilsService.convertFromMapToArrayValues(this.localStorageService.getCategories());
    const locations: AppLocation[] = [];
    if (categories) {
      categories.forEach((category: Category) => {
        if (category.locations) {
          category.locations.forEach((location: AppLocation) => {
            locations.push(location);
          });
        }
      });
    }
    this.locations = locations;
    locationResponse.locations = locations;
    return of(locationResponse);
  }

  public getLocation(locationName: string): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    const categories: Category[] = this.utilsService.convertFromMapToArrayValues(this.localStorageService.getCategories());
    let locationRes: AppLocation;
    for (const category of categories) {
      if (category.locations) {
        for (const location of category.locations) {
          if (location.name === locationName) {
            locationRes = location;
            break;
          }
        }
      }
    }

    if (!locationRes) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
    } else {
      locationResponse.locations = [locationRes];
    }
    return of(locationResponse);
  }

  public createLocation(location: AppLocation): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    const locationCategoryName = location.category;
    const categories: Map<string, Category> = this.localStorageService.getCategories();
    const category = categories.get(locationCategoryName);
    if (!category) {
      locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
      return of(locationResponse);
    }

    if (!category.locations) {
      category.locations = [];
    }
    category.locations.push(location);
    this.locations.push(location);
    this.localStorageService.setCategories(categories);
    locationResponse.locations = this.locations;
    return of(locationResponse);
  }

  public updateLocation(locationName: string, locationCategoryName: string, newLocation: AppLocation): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    const categories: Map<string, Category> = this.localStorageService.getCategories();
    const categoryToUpdate = categories.get(locationCategoryName);
    if (!categoryToUpdate || !categoryToUpdate.locations) {
      locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
      return of(locationResponse);
    }


    const locationToUpdateIndex = categoryToUpdate.locations.findIndex((loc: AppLocation) =>
      loc.name === locationName
    );
    if (locationToUpdateIndex === -1) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
      return of(locationResponse);
    }
    categoryToUpdate.locations[locationToUpdateIndex] = newLocation;
    categories.set(categoryToUpdate.categoryName, categoryToUpdate);
    this.locations[locationToUpdateIndex] = newLocation;
    this.localStorageService.setCategories(categories);
    locationResponse.location = newLocation;
    return of(locationResponse);
  }

  public deleteLocation(locationName: string, locationCategoryName: string): Observable<LocationResponse> {
    const locationResponse = new LocationResponse();
    const categories: Map<string, Category> = this.localStorageService.getCategories();
    const targetCat = categories.get(locationCategoryName);
    if (!targetCat || !targetCat.locations) {
      locationResponse.status = LocationStatusEnum.LOCATION_CATEGORY_NOT_FOUND;
      return of(locationResponse);
    }

    const locationToDeleteIndex = targetCat.locations.findIndex((loc: AppLocation) =>
      loc.name === locationName
    );
    if (locationToDeleteIndex === -1) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND;
      return of(locationResponse);
    }
    targetCat.locations.splice(locationToDeleteIndex, 1);
    this.locations.splice(locationToDeleteIndex, 1);
    categories.set(targetCat.categoryName, targetCat);
    this.localStorageService.setCategories(categories);
    return of(locationResponse);
  }
}
