import { DialogModes } from './../../model/dialog-modes';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: string;
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
  constructor(
    private dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    switch (data.mode) {
      case DialogModes.Add:
        this.addOrEditButtonText = 'Add';
        break;

      case DialogModes.Edit:
        this.addOrEditButtonText = 'Edit';
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}