import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CategoryListComponent } from '@components/categories/category-list/category-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryDialogComponent } from './dialogs/category-dialog/category-dialog';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDialogComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    MatListModule,
  ],

  exports: [
    CategoryDialogComponent
  ],
  entryComponents: [CategoryDialogComponent]
})
export class CategoriesModule { }
