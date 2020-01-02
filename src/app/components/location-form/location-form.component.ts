import { LocationResponse } from './../../model/location-response';
import { LocationService } from 'src/app/services/location/location.service';
import { CategoryService } from './../../services/category/category.service';

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Category } from 'src/app/model/category';
import { CategoryResponse } from 'src/app/model/category.response';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coordinate, AppLocation } from 'src/app/model/location';
import { DialogModes } from 'src/app/model/dialog-modes';

export interface LocationDialogData {
  locationName: string;

  locationCategory: string;

  mode: DialogModes;
}

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {

  confirmation: string;
  cancel: string = 'Cancel';
  latitude = 32;
  longitude = 34.78;


  selectedMarker: Coordinate = new Coordinate(this.latitude, this.longitude);

  categories: Category[] = [];


  selectedCategoryName: string;

  locationForm: FormGroup;
  constructor(private _formBuilder: FormBuilder,
    private _categoryService: CategoryService,
    private _locationService: LocationService,
    private _dialogRef: MatDialogRef<LocationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationDialogData) {
    this.createForm();
    switch (data.mode) {

      case DialogModes.Add:
        this.confirmation = 'Add Location';
        break;
      case DialogModes.Edit:
        this.confirmation = 'Edit Location';
        break;
    }
    this._categoryService.getCategories().subscribe((response: CategoryResponse) => {
      this.categories = response.categories;
    });
  }

  ngOnInit() {

    if (this.data.mode === DialogModes.Edit) {
      this._locationService.getLocation(this.data.locationName).subscribe((response: LocationResponse) => {
        if (response.status) {
          //TODO Should return message with status 
          return;
        }
        const location = response.locations[0];
        this.updateForm(location);
      });
    }
  }




  private createForm() {
    this.locationForm = this._formBuilder.group({
      locationName: new FormControl('Work'),
      locationAddress: new FormControl('Tel Aviv'),
      selectedCategory: new FormControl('')
    });
  }

  private updateForm(location: AppLocation) {
    this.locationForm.controls.locationName.setValue(location.name);
    this.locationForm.controls.locationAddress.setValue(location.address);
    this.locationForm.controls.selectedCategory.setValue(location.category);
    this.latitude = location.coords.lat;
    this.longitude = location.coords.lng;
  }
  addMarker(latInput: number, lngInput: number) {
    this.selectedMarker.lat = latInput;
    this.selectedMarker.lng = lngInput;
  }

  onConfirmClick() {
    const location: AppLocation = new AppLocation(this.locationForm.get('locationName').value,
      this.locationForm.get('locationAddress').value, this.selectedMarker,
      this.locationForm.get('selectedCategory').value);
    this._dialogRef.close(location);
  }
  onCancelClick(): void {
    this._dialogRef.close();
  }

}
