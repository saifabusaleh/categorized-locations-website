import { LocationResponse, LocationStatusEnum } from '@models/location-response';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '@services/location/location.service';
import { AppLocation } from '@models/location';
import { DialogModes } from '@enums/dialog-modes';
import { AppPaths } from '@enums/app-paths';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { LocationFormDialogComponent } from '@components/locations/dialogs/location-form-dialog/location-form-dialog.component';

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
              private locationService: LocationService,
              private router: Router,
              private dialog: MatDialog,
              private snackBarService: SnackBarService) { }

  ngOnInit() {

    this.locationName = this.route.snapshot.paramMap.get('locationName');
    if (this.locationName) {
      this.getLocation(this.locationName);
    }
  }

  getLocation(locationName: string) {
    this.locationService.getLocation(locationName).subscribe((response: LocationResponse) => {
      if (response.status) {
        // handle
        return;
      }
      this.location = response.locations[0];
      this.categoryName = this.location.category;
      this.latitude = this.location.coords.lat;
      this.longitude = this.location.coords.lng;
    });
  }

  onEditLocation() {
    const dialogRef = this.openLocationDialog(DialogModes.Edit);
    dialogRef.afterClosed().subscribe((location: AppLocation) => {
      this.performUpdateLocation(location);
    });
  }

  onDeleteLocation() {
    this.performDeleteLocation();
  }

  openLocationDialog(modeInput: DialogModes) {
    const dialogRef = this.dialog.open(LocationFormDialogComponent, {
      data: { locationName: this.locationName, locationCategory: this.categoryName, mode: modeInput },
      width: '500px'
    });
    return dialogRef;
  }

  private performUpdateLocation(newLocation: AppLocation) {
    if (newLocation) {
      this.locationService.updateLocation(this.locationName, this.categoryName, newLocation).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, this.locationName);
          return;
        }
        this.router.navigate(['/' + AppPaths.Locations + '/' +  response.location.name]);
        this.location = response.location;
        this.locationName = this.location.name;
      });
    }
  }

  private performDeleteLocation() {
    this.locationService.deleteLocation(this.locationName, this.categoryName).subscribe((response: LocationResponse) => {
      if (response.status) {
        this.handleError(response.status, this.locationName);
        return;
      }
      this.router.navigate(['/' + AppPaths.Locations]);
    });
  }

  private handleError(status: LocationStatusEnum, parameter?: string) {
    this.snackBarService.showSnackBar(status.replace('{0}', parameter));
  }

}
