import { AppLocation } from './location';

export enum LocationStatusEnum {
    LOCATION_ALREADY_EXIST = 'Location {0} already exist',
    LOCATION_NOT_FOUND = 'Location {0} not found',
    LOCATION_CATEGORY_NOT_FOUND = 'Location category not found',
}
export class LocationResponse {

    locations: AppLocation[];

    location: AppLocation;

    status: LocationStatusEnum;


}