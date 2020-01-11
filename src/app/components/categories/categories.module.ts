import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryDialog } from './dialogs/category-dialog/category-dialog';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';



@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDialog
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    // MatFormFieldModule,
    SharedModule,
    MatListModule,
    

  ],

  exports: [
    CategoryDialog
  ],
  entryComponents: [CategoryDialog]
})
export class CategoriesModule { }
