import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  {
    path: 'categories',
   loadChildren: () => import('./components/categories/categories.module').then(m => m.CategoriesModule)

  },
  {
    path: 'locations',
    loadChildren: () => import('./components/locations/locations.module').then(m => m.LocationsModule)

  },
   { path: '', redirectTo: '/categories', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
