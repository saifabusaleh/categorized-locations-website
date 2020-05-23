import { DialogModes } from '@enums/dialog-modes';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface CategoryDialogData {
  categoryName: string;

  mode: DialogModes;
}

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.html',
})
export class CategoryDialogComponent {

  addOrEditButtonText: string;

  title: string;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private translate: TranslateService) {
    switch (data.mode) {
      case DialogModes.Add:
        this.title = this.translate.instant('CATEGORY_DIALOG.NEW_TITLE');
        this.addOrEditButtonText = this.translate.instant('CATEGORY_DIALOG.ADD_TEXT');
        break;

      case DialogModes.Edit:
        this.title = this.translate.instant('CATEGORY_DIALOG.EDIT_TITLE');
        this.addOrEditButtonText = this.translate.instant('CATEGORY_DIALOG.EDIT_TEXT');
        break;
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
