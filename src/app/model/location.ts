
export class Coordinate {
    lat: number;
    lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

}
export class AppLocation {

    name: string;
    address: string;
    coords: Coordinate;
    category: string;

    constructor(
        locationName: string, locationAddress: string, locationCords: Coordinate,
        locationCategory: string) {
        this.name = locationName;
        this.coords = locationCords;
        this.address = locationAddress;
        this.category = locationCategory;
    }
}


export enum LocationStatusEnum {
    LOCATION_ALREADY_EXIST = 'Location {0} already exist',
    LOCATION_NOT_FOUND = 'Location {0} not found',
    LOCATION_CATEGORY_NOT_FOUND = 'Location category not found',
}
export class LocationResponse {

    locations: AppLocation[];

    location: AppLocation;

    status: string;
}