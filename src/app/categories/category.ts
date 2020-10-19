import { AppLocation } from '../locations/location';

export class Category {
    categoryName: string;

    constructor(categoryName: string) {
        this.categoryName = categoryName;
    }
}


export enum CategoryStatusEnum {
    CATEGORY_ALREADY_EXIST = 'Category {0} already exist',
    CATEGORY_NOT_FOUND = 'Category {0} not found',
}
export class CategoryResponse {

    categories: Category[];

    status: string;

    locations: AppLocation[];
}
