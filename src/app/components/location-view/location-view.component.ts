import { LocationResponse } from './../../model/location-response';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/services/location/location.service';
import { AppLocation } from 'src/app/model/location';

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent implements OnInit {

  location: AppLocation;
  latitude: number;
  longitude: number;
  

  constructor(private route: ActivatedRoute,
    private _locationService: LocationService) { }

  ngOnInit() {

    const locationName = this.route.snapshot.paramMap.get('locationName');
    const categoryName = this.route.snapshot.paramMap.get('categoryName');
    if (locationName) {
      this.getLocation(locationName, categoryName);
    }
  }

  getLocation(locationName: string, categoryName: string) {
    this._locationService.getLocation(locationName, categoryName).subscribe((response: LocationResponse) => {
      if (response.status) {
        //handle
        return;
      }
      this.location = response.locations[0];
      this.latitude = this.location.coords.lat;
      this.longitude = this.location.coords.lng;
    });
  }

}
