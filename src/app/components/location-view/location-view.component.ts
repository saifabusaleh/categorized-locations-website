import { LocationResponse, LocationStatusEnum } from './../../model/location-response';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from 'src/app/services/location/location.service';
import { AppLocation } from 'src/app/model/location';
import { DialogModes } from 'src/app/model/dialog-modes';
import { AppPaths } from 'src/app/model/app-paths';
import { MatDialog } from '@angular/material/dialog';
import { LocationFormDialogComponent } from 'src/app/dialogs/location-form-dialog/location-form-dialog.component';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent implements OnInit {

  locationName: string;
  private categoryName: string;

  location: AppLocation;
  latitude: number;
  longitude: number;


  constructor(private route: ActivatedRoute,
    private _locationService: LocationService,
    private _router: Router,
    private _dialog: MatDialog,
    private _snackBarService: SnackBarService) { }

  ngOnInit() {

    this.locationName = this.route.snapshot.paramMap.get('locationName');
    if (this.locationName) {
      this.getLocation(this.locationName);
    }
  }

  getLocation(locationName: string) {
    this._locationService.getLocation(locationName).subscribe((response: LocationResponse) => {
      if (response.status) {
        //handle
        return;
      }
      this.location = response.locations[0];
      this.categoryName = this.location.category;
      this.latitude = this.location.coords.lat;
      this.longitude = this.location.coords.lng;
    });
  }

  onEditLocation() {
    let dialogRef = this.openLocationDialog(DialogModes.Edit);
    dialogRef.afterClosed().subscribe((location: AppLocation) => {
      this.performUpdateLocation(location);
    });
  }

  onDeleteLocation() {
    this.performDeleteLocation();
  }

  openLocationDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(LocationFormDialogComponent, {
      data: { locationName: this.locationName, locationCategory: this.categoryName, mode: modeInput },
      width: '500px'
    });
    return dialogRef;
  }

  private performUpdateLocation(newLocation: AppLocation) {
    if (newLocation) {
      this._locationService.updateLocation(this.locationName, this.categoryName, newLocation).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, this.locationName);
          return;
        }
        this._router.navigate(['/' + AppPaths.Location + '/' +  response.location.name]);
        this.location = response.location;
        this.locationName = this.location.name;
      });
    }
  }

  private performDeleteLocation() {
    this._locationService.deleteLocation(this.locationName, this.categoryName).subscribe((response: LocationResponse) => {
      if (response.status) {
        this.handleError(response.status, this.locationName);
        return;
      }
      this._router.navigate(['/' + AppPaths.Locations]);
    });
  }

  private handleError(status: LocationStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }

}
