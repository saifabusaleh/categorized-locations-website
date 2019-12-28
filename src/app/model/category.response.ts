import { Category } from './category';

export enum CategoryStatusEnum {
    CATEGORY_ALREADY_EXIST,
    CATEGORY_NOT_FOUND,
}
export class CategoryResponse {

    categories: Category[];

    status: CategoryStatusEnum;

}