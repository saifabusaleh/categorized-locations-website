import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { Category } from '@models/category';
import { AppPaths } from '@models/app-paths';
import { Component } from '@angular/core';
import { CategoryService } from '@services/category/category.service';
import { CategoryResponse, CategoryStatusEnum } from '@models/category.response';
import { Subscription } from 'rxjs';
import { DialogModes } from '@models/dialog-modes';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialog } from 'src/app/components/categories/dialogs/category-dialog/category-dialog';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {


  selectedCategoryName: string;
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

  onEditCategory() {
    let dialogRef = this.openCategoryDialog(DialogModes.Edit);
    dialogRef.afterClosed().subscribe(categoryName => {
      this.performUpdateCategory(categoryName);
    });
  }

  onDeleteCategory() {
    this.performDeleteCategory();
  }

  private performUpdateCategory(newCategoryName: string) {
    if (newCategoryName) {
      this._categoryService.updateCategoryName(this.selectedCategoryName, newCategoryName).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this.handleError(response.status, this.selectedCategoryName);
          return;
        }
        this.updateDataSource(response.categories);
      });
    }
  }

  private performDeleteCategory() {

    this._categoryService.deleteCategory(this.selectedCategoryName).subscribe((response: CategoryResponse) => {
      if (response.status) {
         this.handleError(response.status, this.selectedCategoryName);
        return;
      }
      this.updateDataSource(response.categories);
    });
  }

  private updateDataSource(categories: Category[]) {
    this.categories = categories;
    this.selectedCategoryName = undefined;
  }

  private handleError(status: CategoryStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }

  onSelectionChange(event: MatRadioChange) {
    this.selectedCategoryName = event.value;
  }
}
