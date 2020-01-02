import { Category } from './category';

export class Coordinate {
    constructor(lat: number, lng: number) {
        this._lat = lat;
        this._lng = lng;
    }
    private _lat: number;
    private _lng: number;

    get lat() { 
        return this._lat;
    }

    set lat(latInput: number) {
        this._lat = latInput;
    }

    get lng() { 
        return this._lng;
    }

    set lng(lngInput: number) {
        this._lng = lngInput;
    }
}
export class AppLocation {

    constructor(locationName: string, locationAddress: string, locationCords: Coordinate,
        locationCategory: string) {
        this._name = locationName;
        this._coords = locationCords;
        this._address = locationAddress;
        this._category = locationCategory;
    }

    
    private _name: string;
    private _address: string;

    get name() {
        return this._name;
    }

    get address() {
        return this._address;
    }

    get category() {
        return this._category;
    }


    get coords() {
        return this._coords;
    }

    private _coords: Coordinate;
    private _category: string;
}