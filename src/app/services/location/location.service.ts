import { Injectable } from '@angular/core';
import { AppLocation, LocationStatusEnum, LocationResponse } from '@models/location';
import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { UtilsService } from '@services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private locationsMap: Map<string, AppLocation>;

  constructor(private localStorageService: LocalStorageService,
              private utilsService: UtilsService) {
    this.locationsMap = new Map();
    this.locationsMap = this.localStorageService.getLocations();
  }

  public getLocations(): LocationResponse {
    const locationResponse = new LocationResponse();
    const locationsArr = this.utilsService.convertFromMapToArrayValues(this.locationsMap);
    locationResponse.locations = locationsArr;
    return locationResponse;
  }

  public getLocation(locationName: string): LocationResponse {
    const locationResponse = new LocationResponse();
    const location = this.locationsMap.get(locationName);
    if (!location) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND.replace('{0}', locationName);
    } else {
      locationResponse.locations = [location];
    }
    return locationResponse;
  }

  public createLocation(location: AppLocation): LocationResponse {
    const locationResponse = new LocationResponse();
    if (this.locationsMap.get(location.name)) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND.replace('{0}', location.name);
      return locationResponse;
    }
    this.locationsMap.set(location.name, location);
    this.localStorageService.setLocations(this.locationsMap);
    locationResponse.locations = this.utilsService.convertFromMapToArrayValues(this.locationsMap);
    return locationResponse;
  }

  public updateLocation(locationName: string, newLocation: AppLocation): LocationResponse {
    const locationResponse = new LocationResponse();
    if (!this.locationsMap.get(locationName)) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND.replace('{0}', locationName);
      return locationResponse;
    }
    this.locationsMap.delete(locationName);
    this.locationsMap.set(newLocation.name, newLocation);
    this.localStorageService.setLocations(this.locationsMap);
    locationResponse.location = newLocation;
    return locationResponse;
  }

  public deleteLocation(locationName: string): LocationResponse {
    const locationResponse = new LocationResponse();
    if (!this.locationsMap.delete(locationName)) {
      locationResponse.status = LocationStatusEnum.LOCATION_NOT_FOUND.replace('{0}', locationName);
      return locationResponse;
    }
    this.localStorageService.setLocations(this.locationsMap);
    return locationResponse;
  }
}
