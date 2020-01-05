import { LocationStatusEnum } from './../../model/location-response';
import { AppPaths } from './../../model/app-paths';
import { LocationService } from './../../services/location/location.service';
import { AppLocation } from './../../model/location';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocationResponse } from 'src/app/model/location-response';
import { DialogModes } from 'src/app/model/dialog-modes';
import { LocationFormDialogComponent } from 'src/app/dialogs/location-form-dialog/location-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar/snack-bar.service';
export interface LocationData {
  name: string;
  address: string;
  categoryName: string;
}

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  appPathsEnum = AppPaths;


  reducedGroups = [];

  dataSource: MatTableDataSource<LocationData>;

  displayedColumns: string[] = ['name', 'address', 'categoryName'];

  constructor(private _locationService: LocationService,
              private _dialog: MatDialog,
              private _snackBarService: SnackBarService) {

    this._locationService.getLocations().subscribe((response: LocationResponse) => {
      this.dataSource = new MatTableDataSource(this.convertFromAppLocationToLocationData(response.locations));
    });
  }



  private updateGridWithDataSource() {
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.categoryName.toLowerCase().includes(filter);
    };
  }
  ngOnInit() {
    this.updateGridWithDataSource();
  }

  private convertFromAppLocationToLocationData(locationsInput: AppLocation[]): LocationData[] {
    let res: LocationData[] = [];
    locationsInput.forEach((location: AppLocation) => {
      let locationDataItem: LocationData = {
        name: location.name,
        address: location.address,
        categoryName: location.category
      };
      res.push(locationDataItem);
    });
    return res;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onAddLocation() {
    let dialogRef = this.openLocationDialog(DialogModes.Add);
    dialogRef.afterClosed().subscribe((location: AppLocation) => {
      this.performAddLocation(location);
    });
  }

  openLocationDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(LocationFormDialogComponent, {
      data: { locationName: '', locationCategory: '' , mode: modeInput },
      width: '500px'
    });
    return dialogRef;
  }
  private performAddLocation(location: AppLocation) {
    if (location) {
      this._locationService.createLocation(location).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, `Category ${location.category} not found!`);
         return;
        }
        this.dataSource = new MatTableDataSource(this.convertFromAppLocationToLocationData(response.locations));
        this.updateGridWithDataSource();
      });
    }
  }

  private handleError(status: LocationStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }
}
