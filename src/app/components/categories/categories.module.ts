import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryDialog } from './dialogs/category-dialog/category-dialog';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { CategoryListComponent } from '@components/categories/category-list/category-list.component';



@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDialog
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    MatListModule,
  ],

  exports: [
    CategoryDialog
  ],
  entryComponents: [CategoryDialog]
})
export class CategoriesModule { }
