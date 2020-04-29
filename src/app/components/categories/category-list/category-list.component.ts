import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { Category } from '@models/category';
import { AppPaths } from '@enums/app-paths';
import { Component} from '@angular/core';
import { CategoryService } from '@services/category/category.service';
import { CategoryResponse, CategoryStatusEnum } from '@models/category.response';
import { Observable, of} from 'rxjs';
import { DialogModes } from '@enums/dialog-modes';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialog } from 'src/app/components/categories/dialogs/category-dialog/category-dialog';
import { MatRadioChange } from '@angular/material/radio';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent{
  appPathsEnum = AppPaths;


  selectedCategoryName: string;
  categories$: Observable<Category[]>;



  constructor(private _categoryService: CategoryService,
              private _dialog: MatDialog,
              private _snackBarService: SnackBarService) {
    this.categories$ = this._categoryService.getCategories().pipe(map(res => res.categories));
  }


  onAddCategory() {
    let dialogRef = this.openCategoryDialog(DialogModes.Add);
    dialogRef.afterClosed().subscribe(categoryName => {
      this._performAddCategory(categoryName);
    });
  }

  openCategoryDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(CategoryDialog, {
      width: '260px',
      data: { categoryName: '', mode: modeInput }
    });
    return dialogRef;
  }



  onEditCategory() {
    let dialogRef = this.openCategoryDialog(DialogModes.Edit);
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
      this._categoryService.createCategory(new Category(categoryName)).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this._handleError(response.status, categoryName);
          return;
        }
        this.categories$ = of(response.categories);
      });
    }
  }

  private _performUpdateCategory(newCategoryName: string) {
    if (newCategoryName) {
      this._categoryService.updateCategoryName(this.selectedCategoryName, newCategoryName).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this._handleError(response.status, this.selectedCategoryName);
          return;
        }
        this._updateDataSource(response.categories);
      });
    }
  }

  private _performDeleteCategory() {

    this._categoryService.deleteCategory(this.selectedCategoryName).subscribe((response: CategoryResponse) => {
      if (response.status) {
         this._handleError(response.status, this.selectedCategoryName);
        return;
      }
      this._updateDataSource(response.categories);
    });
  }

  private _updateDataSource(categories: Category[]) {
    this.categories$ = of(categories);
    this.selectedCategoryName = undefined;
  }

  private _handleError(status: CategoryStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }


}
