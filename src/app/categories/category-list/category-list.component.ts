import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Category, CategoryResponse } from 'src/app/categories/category';
import { CategoryService } from 'src/app/categories/category.service';
import { AppPaths } from 'src/app/shared/app-paths';
import { DialogModes } from 'src/app/shared/dialog-modes';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { CategoryDialogComponent } from '../dialogs/category-dialog/category-dialog';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})

export class CategoryListComponent {
  appPathsEnum = AppPaths;


  selectedCategoryName: string;
  categories: Category[];



  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService) {
    this.categories = this.categoryService.getCategories().categories;
  }


  onAddCategory() {
    const dialogRef = this.openCategoryDialog(DialogModes.Add, '');
    dialogRef.afterClosed().subscribe(categoryName => {
      this._performAddCategory(categoryName);
    });
  }

  openCategoryDialog(modeInput: DialogModes, categoryName: string) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '260px',
      data: { categoryName, mode: modeInput }
    });
    return dialogRef;
  }



  onEditCategory() {
    const dialogRef = this.openCategoryDialog(DialogModes.Edit, this.selectedCategoryName);
    dialogRef.afterClosed().subscribe(categoryName => {
      this._performUpdateCategory(categoryName);
    });
  }

  onDeleteCategory() {
    this._performDeleteCategory();
  }

  onSelectionChange(event: MatRadioChange) {
    this.selectedCategoryName = event.value;
  }

  private _performAddCategory(categoryName: string) {
    if (categoryName) {
      const response: CategoryResponse = this.categoryService.createCategory(new Category(categoryName));
      if (response.status) {
        this.snackBarService.showSnackBar(response.status);
        return;
      }
      this.categories = response.categories;
    }
  }

  private _performUpdateCategory(newCategoryName: string) {
    if (newCategoryName) {
      const response = this.categoryService.updateCategoryName(this.selectedCategoryName, newCategoryName);
      if (response.status) {
        this.snackBarService.showSnackBar(response.status);
        return;
      }
      this._updateDataSource(response.categories);
    }
  }

  private _performDeleteCategory() {
    const response = this.categoryService.deleteCategory(this.selectedCategoryName);
    if (response.status) {
      this.snackBarService.showSnackBar(response.status);
      return;
    }
    this._updateDataSource(response.categories);
  }

  private _updateDataSource(categories: Category[]) {
    this.categories = categories;
    this.selectedCategoryName = undefined;
  }
}
