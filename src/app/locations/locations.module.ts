import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { API_KEY } from 'env';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationFormDialogComponent } from './dialogs/location-form-dialog/location-form-dialog.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationViewComponent } from './location-view/location-view.component';
import { LocationService } from './location.service';
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

  providers: [LocationService],

  entryComponents: [
    LocationFormDialogComponent
  ]
})
export class LocationsModule { }
