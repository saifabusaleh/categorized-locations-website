import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPaths } from 'src/app/shared/app-paths';
import { DialogModes } from 'src/app/shared/dialog-modes';
import { AppLocation, Coordinate } from 'src/app/locations/location';
import { LocationService } from 'src/app/locations/location.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { LocationFormDialogComponent } from '../dialogs/location-form-dialog/location-form-dialog.component';

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent implements OnInit {

  locationName: string;
  private categoryName: string;

  location: AppLocation;
  coordinate: Coordinate;


  constructor(
    private route: ActivatedRoute,
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
    const response = this.locationService.getLocation(locationName);
    if (response.status) {
      // handle
      return;
    }
    this.location = response.locations[0];
    this.categoryName = this.location.category;
    this.coordinate = this.location.coords;
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
      const response = this.locationService.updateLocation(this.locationName, newLocation);

      if (response.status) {
        this.snackBarService.showSnackBar(response.status);
        return;
      }
      this.router.navigate([AppPaths.Locations + '/' + response.location.name], { replaceUrl: true });
      this.location = response.location;
      this.locationName = this.location.name;
    }
  }

  private performDeleteLocation() {
    const response = this.locationService.deleteLocation(this.locationName);

    if (response.status) {
      this.snackBarService.showSnackBar(response.status);
      return;
    }
    this.router.navigate([AppPaths.Locations]);

  }
}
