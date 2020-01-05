import { SnackBarService } from './../../services/snack-bar/snack-bar.service';
import { Category } from './../../model/category';
import { AppPaths } from './../../model/app-paths';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryResponse, CategoryStatusEnum } from 'src/app/model/category.response';
import { Subscription } from 'rxjs';
import { DialogModes } from 'src/app/model/dialog-modes';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialog } from 'src/app/dialogs/category-dialog/category-dialog';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {

  categories: Category[] = [];
  subscription: Subscription;


  appPathsEnum = AppPaths;
  constructor(private _categoryService: CategoryService,
              private _dialog: MatDialog,
              private _snackBarService: SnackBarService) {
    this._categoryService.getCategories().subscribe((response: CategoryResponse) => {
      this.categories = response.categories;
    });
  }


  onAddCategory() {
    let dialogRef = this.openCategoryDialog(DialogModes.Add);
    dialogRef.afterClosed().subscribe(categoryName => {
      this.performAddCategory(categoryName);
    });
  }

  openCategoryDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(CategoryDialog, {
      width: '260px',
      data: { categoryName: '', mode: modeInput }
    });
    return dialogRef;
  }

  private performAddCategory(categoryName: string) {
    if (categoryName) {
      this._categoryService.createCategory(new Category(categoryName)).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this.handleError(response.status, categoryName);
          return;
        }
        this.categories = response.categories;
      });
    }
  }

  private handleError(status: CategoryStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }
}
