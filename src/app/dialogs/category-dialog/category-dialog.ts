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

  close: string = 'Close';

  buttonText: string;
  constructor(
    private dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    switch (data.mode) {
      case DialogModes.Add:
        this.buttonText = 'Add';
        break;

      case DialogModes.Edit:
        this.buttonText = 'Edit';
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}