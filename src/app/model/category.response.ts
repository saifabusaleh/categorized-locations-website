import { AppLocation } from './location';
import { Category } from './category';

export enum CategoryStatusEnum {
    CATEGORY_ALREADY_EXIST = 'Category {0} already exist',
    CATEGORY_NOT_FOUND = 'Category {0} not found',
}
export class CategoryResponse {

    categories: Category[];

    categoriesMap: Map<string, Category>;

    status: CategoryStatusEnum;

    locations: AppLocation[];

}
