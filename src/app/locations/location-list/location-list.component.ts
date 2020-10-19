import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppPaths } from 'src/app/shared/app-paths';
import { DialogModes } from 'src/app/shared/dialog-modes';
import { AppLocation } from 'src/app/locations/location';
import { LocationService } from 'src/app/locations/location.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';
import { LocationFormDialogComponent } from '../dialogs/location-form-dialog/location-form-dialog.component';
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
export class LocationListComponent implements OnInit {

  appPathsEnum = AppPaths;

  // private _isInGroupingMode: boolean;
  groupByColumns: string[] = ['categoryName'];

  dataSource: MatTableDataSource<LocationData>;

  displayedColumns: string[] = ['name', 'address', 'categoryName'];


  private locations: LocationData[];


  private tableLogic: TableLogic;

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog,
    private snackBarService: SnackBarService) {
    this.locations = [];
    const response = this.locationService.getLocations();
    this.locations = this.convertFromAppLocationToLocationData(response.locations);
    this.tableLogic = new TableLogic(new MatTableDataSource(this.locations), this.groupByColumns);
    this.dataSource = this.tableLogic.dataSource;
  }

  ngOnInit() {
    this.tableLogic.updateGridWithDataSource();
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
      const response = this.locationService.createLocation(location);

      if (response.status) {
        this.snackBarService.showSnackBar(response.status);
        return;
      }
      this.locations = this.convertFromAppLocationToLocationData(response.locations);
      this.tableLogic.updateGridData(this.locations);
      this.tableLogic.updateGridWithDataSource();
    }
  }
}
