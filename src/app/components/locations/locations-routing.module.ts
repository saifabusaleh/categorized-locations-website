import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationViewComponent } from './location-view/location-view.component';
import { LocationListComponent } from './location-list/location-list.component';


const routes: Routes = [

  {
    path: '',
    component: LocationListComponent,
  },

  {
    path: ':locationName',
    component: LocationViewComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
