import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { DialogModes } from 'src/app/model/dialog-modes';
import { CategoryDialog } from 'src/app/dialogs/category-dialog/category-dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryResponse, CategoryStatusEnum } from 'src/app/model/category.response';
import { AppPaths } from 'src/app/model/app-paths';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {

  categoryName: string;
  constructor(private _dialog: MatDialog,
    private _router: Router,
    private _categoryService: CategoryService,
    private route: ActivatedRoute,
    private _snackBarService: SnackBarService
  ) {
    //
  }

  ngOnInit() {
    this.categoryName = this.route.snapshot.paramMap.get('name');
    //
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

  openCategoryDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(CategoryDialog, {
      width: '260px',
      data: { categoryName: '', mode: modeInput }
    });
    return dialogRef;
  }

  private performUpdateCategory(newCategoryName: string) {
    if (newCategoryName) {
      this._categoryService.updateCategoryName(this.categoryName, newCategoryName).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this.handleError(response.status, this.categoryName);
          return;
        }
        this._router.navigate(['/' + AppPaths.CategoryDetails + '/' + newCategoryName], { replaceUrl: true });
        this.categoryName = newCategoryName;
      });
    }
  }

  private performDeleteCategory() {

    this._categoryService.deleteCategory(this.categoryName).subscribe((response: CategoryResponse) => {
      if (response.status) {
         this.handleError(response.status, this.categoryName);
        return;
      }
      this._router.navigate(['/']);
    });
  }

  private handleError(status: CategoryStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }


}
