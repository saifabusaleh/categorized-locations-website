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

export class Group {

  level: number = 0;
  parent: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  appPathsEnum = AppPaths;

  private _isInGroupingMode: boolean;

  dataSource: MatTableDataSource<LocationData>;

  displayedColumns: string[] = ['name', 'address', 'categoryName'];

  groupByColumns: string[] = ['categoryName'];

  private _locations: LocationData[];


  constructor(private _locationService: LocationService,
    private _dialog: MatDialog,
    private _snackBarService: SnackBarService) {
    this._locations = [];
    this._locationService.getLocations().subscribe((response: LocationResponse) => {
      this._locations = this.convertFromAppLocationToLocationData(response.locations);
      this.dataSource = new MatTableDataSource(this._locations);
    });
  }



  private updateGridWithDataSource() {

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
      data: { locationName: '', locationCategory: '', mode: modeInput },
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
        this._locations = this.convertFromAppLocationToLocationData(response.locations);
        this.updateGridData(this._isInGroupingMode);
        this.updateGridWithDataSource();
      });
    }
  }

  private handleError(status: LocationStatusEnum, parameter?: string) {
    this._snackBarService.showSnackBar(status.replace('{0}', parameter));
  }


  getDataRowVisible(data: LocationData): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }

        let match = true;
        this.groupByColumns.forEach(
          column => {
            if (!row[column] || !data[column] || row[column] !== data[column]) {
              match = false;
            }
          }
        );
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    if (groupRows.length > 1) {
      throw 'Data row is in more than one group!';
    }
    const parent = <Group>(groupRows[0] as any);  // </Group> (Fix syntax coloring)

    return parent.visible && parent.expanded;
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    var rootGroup = new Group();
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    // Recursive function, stop when there are no more levels. 
    if (level >= groupByColumns.length) {
      return data;
    }


    var groups = this.uniqueBy(
      data.map(
        row => {
          var result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (var i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];

    var subGroups = [];
    groups.forEach(group => {
      let rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      let subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  onToggleChange(enabled: boolean) {
    this._isInGroupingMode = enabled;
    this.updateGridData(this._isInGroupingMode);
  }

  private updateGridData(groupingMode: boolean) {
    if (groupingMode) {
      this.dataSource.data = this.addGroups(this._locations, this.groupByColumns);

    } else {
      this.dataSource.data = this._locations;
    }
    this.updateGridWithDataSource();
  }

  onSortData(sort: MatSort) {
    let data = this._locations;
    if (sort.active && sort.direction !== '') {

      data = data.sort((a: LocationData, b: LocationData) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name':
            return this.compare(a.name, b.name, isAsc);
          case 'address':
            return this.compare(a.address, b.address, isAsc);
          case 'categoryName':
            return this.compare(a.categoryName, b.categoryName, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource.data = this.addGroups(data, this.groupByColumns);
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
