import { LocationStatusEnum } from '@models/location-response';
import { AppPaths } from '@enums/app-paths';
import { LocationService } from '@services/location/location.service';
import { AppLocation } from '@models/location';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationResponse } from '@models/location-response';
import { DialogModes } from '@enums/dialog-modes';
import { LocationFormDialogComponent } from '@components/locations/dialogs/location-form-dialog/location-form-dialog.component';
import { SnackBarService } from '@services/snack-bar/snack-bar.service';
import { Subscription } from 'rxjs';
import { TableLogic } from './TableLogic';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

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


  private locations: LocationData[];

  private subscription: Subscription;

  private tableLogic: TableLogic;

  constructor(private locationService: LocationService,
              private dialog: MatDialog,
              private snackBarService: SnackBarService) {
    this.locations = [];
    this.subscription = this.locationService.getLocations().subscribe((response: LocationResponse) => {
      this.locations = this.convertFromAppLocationToLocationData(response.locations);
      this.tableLogic = new TableLogic(new MatTableDataSource(this.locations), this.groupByColumns);
      this.dataSource = this.tableLogic.dataSource;
    });
  }

  ngOnInit() {
    this.tableLogic.updateGridWithDataSource();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onApplyFilter(filterValue: string) {
    this.tableLogic.onApplyFilter(filterValue);
  }

  onAddLocation() {
    const dialogRef = this.openLocationDialog(DialogModes.Add);
    dialogRef.afterClosed().subscribe((location: AppLocation) => {
      this.performAddLocation(location);
    });
  }

  openLocationDialog(modeInput: DialogModes) {
    const dialogRef = this.dialog.open(LocationFormDialogComponent, {
      data: { locationName: '', locationCategory: '', mode: modeInput },
      width: '500px'
    });
    return dialogRef;
  }

  onToggleChange(enabled: boolean) {
    this.tableLogic.onToggleChange(enabled, this.locations);
  }

  onSortData(sort: MatSort) {
    this.tableLogic.onSortData(sort, this.locations);
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  private convertFromAppLocationToLocationData(locationsInput: AppLocation[]): LocationData[] {
    const res: LocationData[] = [];
    locationsInput.forEach((location: AppLocation) => {
      const locationDataItem: LocationData = {
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
      this.locationService.createLocation(location).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, `Category ${location.category} not found!`);
          return;
        }
        this.locations = this.convertFromAppLocationToLocationData(response.locations);
        this.tableLogic.updateGridData(this.locations);
        this.tableLogic.updateGridWithDataSource();
      });
    }
  }

  private handleError(status: LocationStatusEnum, parameter?: string) {
    this.snackBarService.showSnackBar(status.replace('{0}', parameter));
  }

}
