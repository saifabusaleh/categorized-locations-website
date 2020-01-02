import { AppPaths } from './../../model/app-paths';
import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/model/category';
import { CategoryResponse } from 'src/app/model/category.response';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  subscription: Subscription;

  categoriesHeader: string = 'Categories';

  appPathsEnum = AppPaths;
  constructor(private _categoryService: CategoryService) {
    this._categoryService.getCategories().subscribe((response: CategoryResponse) => {
      this.categories = response.categories;
    });
  }

  ngOnInit() {
    this.subscription = this._categoryService.getCategoriesObservable().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
