import { AppPaths } from './../../model/app-paths';
import { LocationService } from './../../services/location/location.service';
import { AppLocation } from './../../model/location';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocationResponse } from 'src/app/model/location-response';
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

  columnName: string = 'Name';
  columnAddress: string = 'Address';
  columnCategoryName: string = 'Category Name';
  constructor(private _locationService: LocationService) {

    this._locationService.getLocations().subscribe((response: LocationResponse) => {
      this.dataSource = new MatTableDataSource(this.convertFromAppLocationToLocationData(response.locations));
    });
  }



  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return data.categoryName.toLowerCase().includes(filter);

    };

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

}
