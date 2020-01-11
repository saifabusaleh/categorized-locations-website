import { LocationViewComponent } from './components/location-view/location-view.component';
import { LocationListComponent } from './components/location-list/location-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './components/category-list/category-list.component';


const routes: Routes = [

  {
    path: '',
    component: CategoryListComponent,
  },
  {
    path: 'locations',
    component: LocationListComponent,
  },
  {
    path: 'location/:locationName',
    component: LocationViewComponent,
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
