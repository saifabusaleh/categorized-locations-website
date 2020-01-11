import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationFormDialogComponent } from './dialogs/location-form-dialog/location-form-dialog.component';
import { LocationViewComponent } from './location-view/location-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    LocationListComponent,
    LocationFormDialogComponent,
    LocationViewComponent,
  ],
  imports: [
    CommonModule,
    LocationsRoutingModule,
    SharedModule,
    MatSlideToggleModule,
    MatTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACCrhxPECAdny-D4CO5R6hG_Vo8vjHmR8'
    }),
    ReactiveFormsModule,
    MatSortModule
  ],

  entryComponents: [
    LocationFormDialogComponent
  ]
})
export class LocationsModule { }
