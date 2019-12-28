import { DialogModes } from './../../model/dialog-modes';
import { AppPaths } from './../../model/app-paths';
import { Component, OnInit } from '@angular/core';
import { CategoryDialog } from 'src/app/dialogs/category-dialog/category-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Context } from 'src/app/model/context';
import { Category } from 'src/app/model/category';
import { CategoryResponse } from 'src/app/model/category.response';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})


export class ToolbarComponent implements OnInit {

  isDeleteDisabled: boolean;

  isEditDisabled: boolean;
  isAddDisabled: boolean;


  title = '';


  menuAddCategory = 'Add Category';
  menuEditCategory = 'Edit Category';

  menuDeleteCategory = 'Delete Category';

  newCategoryDialogTitle: string = 'Add Category';

  editCategoryDialogTitle: string = 'Edit Category';
  categoryDialogContent: string = 'What is the category name?';

  currentCategoryName = '';

  constructor(private dialog: MatDialog,
    private router: Router,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar) {

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.updateToolbarAfterRouting(event);
      }
    });
  }

  private updateToolbarAfterRouting(event: NavigationEnd) {
    const urlSegments = event.url.split('/');
    if (urlSegments && urlSegments.length > 2) {
      if (urlSegments[1] === AppPaths.CategoryDetails) { //TODO: Category should be defined once string 
        this.currentCategoryName = urlSegments[2];
        this.updateUIWithContext(Context.Category);
        return;
      }
    }
    this.updateUIWithContext(Context.CategoryList);
  }

  private updateUIWithContext(con: Context) {
    switch (con) {
      case Context.CategoryList:
        this.title = 'Category list';
        this.isAddDisabled = false;
        this.isEditDisabled = this.isDeleteDisabled = true;

        break;

      case Context.Category:
        this.title = 'Category: ' + this.currentCategoryName;
        this.isAddDisabled = true;
        this.isEditDisabled = this.isDeleteDisabled = false;
        break;
    }
  }
  ngOnInit() {
    //
  }

  performCreateCategory(categoryName: string) {
    if (categoryName) {
      this.categoryService.createCategory(new Category(categoryName)).subscribe((response: CategoryResponse) => {
        if (response.status !== undefined) {
          this.showSnackBar('Category already exist');
        }
        console.log(response);
      });
    }
  }

  performUpdateCategory(newCategoryName: string) {
    if (newCategoryName) {
      this.categoryService.getCategoryByName(this.currentCategoryName).subscribe((response: CategoryResponse) => {
        if (response.status !== undefined) {
          this.showSnackBar('Category doesnt exist');
        }
        this.categoryService.updateCategory(response.categories[0], newCategoryName).subscribe((response: CategoryResponse) => {
          console.log(response.categories);
          this.router.navigate([AppPaths.CategoryDetails + '/' + newCategoryName], { replaceUrl: true });
        });
      });
    }
  }
  onAddDialog() {

    const dialogRef = this.openDialog(this.newCategoryDialogTitle, this.categoryDialogContent, DialogModes.Add);
    dialogRef.afterClosed().subscribe(categoryName => {
      console.log('The dialog was closed with output: ', categoryName);
      this.performCreateCategory(categoryName);
    });
  }
  openDialog(titleInput: string, contentInput: string, modeInput: DialogModes) {
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '260px',
      data: { categoryName: '', title: titleInput, content: contentInput, mode: modeInput }
    });
    return dialogRef;
  }

  onEditDialog() {
    const dialogRef = this.openDialog(this.editCategoryDialogTitle, this.categoryDialogContent,  DialogModes.Edit);
    dialogRef.afterClosed().subscribe(categoryName => {
      this.performUpdateCategory(categoryName);
    });
  }

  onDeleteDialog() {
    this.categoryService.getCategoryByName(this.currentCategoryName).subscribe((response: CategoryResponse) => {
      if (response.status !== undefined) {
        console.error('category ', this.currentCategoryName, ' doesnt exist!');
        this.showSnackBar(`category ${this.currentCategoryName} doesnt exist!`);
        this.router.navigate(['/']);
        return;
      }
      let categoryToDelete: Category = response.categories[0];
      this.categoryService.deleteCategory(categoryToDelete).subscribe((response: CategoryResponse) => {
        this.router.navigate(['/']);
      });
    });
  }


  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 7000,
    });
  }
}
