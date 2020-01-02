import { DialogModes } from './../../model/dialog-modes';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CategoryDialogData {
  categoryName: string;

  mode: DialogModes;
}

@Component({
  selector: 'category-dialog',
  templateUrl: './category-dialog.html',
})
export class CategoryDialog {

  closeButtonText: string = 'Close';

  addOrEditButtonText: string;

  title: string;
  newTitle: string = 'Add Category';

  editTitle: string = 'Edit Category';
  content: string = 'What is the category name?';

  constructor(
    private dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData) {
    switch (data.mode) {
      case DialogModes.Add:
        this.title = this.newTitle;
        this.addOrEditButtonText = 'Add';
        break;

      case DialogModes.Edit:
        this.title = this.editTitle;
        this.addOrEditButtonText = 'Edit';
        break;
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}