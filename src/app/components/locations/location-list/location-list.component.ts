import { LocationStatusEnum } from '@models/location-response';
import { AppPaths } from '@models/app-paths';
import { LocationService } from '@services/location/location.service';
import { AppLocation } from '@models/location';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { LocationResponse } from '@models/location-response';
import { DialogModes } from '@models/dialog-modes';
import { LocationFormDialogComponent } from '@components/locations/dialogs/location-form-dialog/location-form-dialog.component';
import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { Subscription } from 'rxjs';
import { TableLogic } from './TableLogic';
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
export class LocationListComponent implements OnInit, OnDestroy {

  appPathsEnum = AppPaths;

  // private _isInGroupingMode: boolean;
  groupByColumns: string[] = ['categoryName'];

  dataSource: MatTableDataSource<LocationData>;

  displayedColumns: string[] = ['name', 'address', 'categoryName'];


  private _locations: LocationData[];

  private _subscription: Subscription;

  private _tableLogic: TableLogic;

  constructor(private _locationService: LocationService,
    private _dialog: MatDialog,
    private _snackBarService: SnackBarService) {
    this._locations = [];
    this._subscription = this._locationService.getLocations().subscribe((response: LocationResponse) => {
      this._locations = this.convertFromAppLocationToLocationData(response.locations);
      this._tableLogic = new TableLogic(new MatTableDataSource(this._locations), this.groupByColumns);
      this.dataSource = this._tableLogic.dataSource;
    });
  }

  ngOnInit() {
    this._tableLogic.updateGridWithDataSource();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onApplyFilter(filterValue: string) {
    this._tableLogic.onApplyFilter(filterValue);
  }

  onAddLocation() {
    let dialogRef = this.openLocationDialog(DialogModes.Add);
    dialogRef.afterClosed().subscribe((location: AppLocation) => {
      this.performAddLocation(location);
    });
  }

  openLocationDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(LocationFormDialogComponent, {
      data: { locationName: '', locationCategory: '', mode: modeInput },
      width: '500px'
    });
    return dialogRef;
  }

  onToggleChange(enabled: boolean) {
    this._tableLogic.onToggleChange(enabled, this._locations);
  }

  onSortData(sort: MatSort) {
    this._tableLogic.onSortData(sort, this._locations);
  }

  isGroup(index, item): boolean {
    return item.level;
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

  private performAddLocation(location: AppLocation) {
    if (location) {
      this._locationService.createLocation(location).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, `Category ${location.category} not found!`);
          return;
        }
        this._locations = this.convertFromAppLocationToLocationData(response.locations);
        this._tableLogic.updateGridData(this._locations);
        this._tableLogic.updateGridWithDataSource();
      });
    }
  }

  private handleError(status: LocationStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }

}
