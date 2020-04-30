import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationListComponent } from '@components/locations/location-list/location-list.component';
import { LocationFormDialogComponent } from '@components/locations/dialogs/location-form-dialog/location-form-dialog.component';
import { LocationViewComponent } from '@components/locations/location-view/location-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import { API_KEY } from 'env';


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
      apiKey: API_KEY
    }),
    ReactiveFormsModule,
    MatSortModule,
    MatCardModule
  ],

  entryComponents: [
    LocationFormDialogComponent
  ]
})
export class LocationsModule { }
