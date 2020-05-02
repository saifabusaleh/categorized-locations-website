import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { Category } from '@models/category';
import { AppPaths } from '@enums/app-paths';
import { Component } from '@angular/core';
import { CategoryService } from '@services/category/category.service';
import { CategoryResponse } from '@models/category.response';
import { DialogModes } from '@enums/dialog-modes';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from 'src/app/components/categories/dialogs/category-dialog/category-dialog';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})

export class CategoryListComponent {
  appPathsEnum = AppPaths;


  selectedCategoryName: string;
  categories: Category[];



  constructor(private categoryService: CategoryService,
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
