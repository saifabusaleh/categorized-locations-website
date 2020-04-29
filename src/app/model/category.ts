import { AppLocation } from './location';
export class Category {
    private _categoryName: string;
    private _locations: AppLocation[];

    get categoryName() {
        return this._categoryName;
    }

    set categoryName(newCategoryName: string) {
        this._categoryName = newCategoryName;
    }

    get locations() {
        return this._locations;
    }

    set locations(locations: AppLocation[]) {
        this._locations = locations;
    }
    constructor(categoryName: string) {
        this._categoryName = categoryName;
    }
}
