import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationViewComponent } from './location-view/location-view.component';


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
