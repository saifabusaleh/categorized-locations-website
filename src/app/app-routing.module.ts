import { LocationViewComponent } from './components/location-view/location-view.component';
import { LocationListComponent } from './components/location-list/location-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { CategoryAuthGuardService } from './guards/category-auth-guard.service';
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
    path: 'category/:name',
    component: CategoryDetailComponent,
    canActivate: [CategoryAuthGuardService]
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
