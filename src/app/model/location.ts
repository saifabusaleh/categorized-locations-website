
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

    constructor(locationName: string, locationAddress: string, locationCords: Coordinate,
                locationCategory: string) {
        this.name = locationName;
        this.coords = locationCords;
        this.address = locationAddress;
        this.category = locationCategory;
    }
}
