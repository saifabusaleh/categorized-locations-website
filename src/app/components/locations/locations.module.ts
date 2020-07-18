import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LocationFormDialogComponent } from '@components/locations/dialogs/location-form-dialog/location-form-dialog.component';
import { LocationListComponent } from '@components/locations/location-list/location-list.component';
import { LocationViewComponent } from '@components/locations/location-view/location-view.component';
import { API_KEY } from 'env';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationsRoutingModule } from './locations-routing.module';



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
