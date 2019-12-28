export class Category {
    constructor(categoryName: string) {
        this._categoryName = categoryName;
    }
    private _categoryName: string;
    private locations: Location[];

    public getCategoryName() {
        return this._categoryName;
    }

    public setCategoryName(newCategoryName: string) {
        this._categoryName = newCategoryName;
    }
}