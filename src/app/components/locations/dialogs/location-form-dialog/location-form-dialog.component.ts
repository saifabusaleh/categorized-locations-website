import { LocationService } from '@services/location/location.service';
import { CategoryService } from '@services/category/category.service';

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Category } from '@models/category';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Coordinate, AppLocation } from '@models/location';
import { DialogModes } from '@enums/dialog-modes';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '@services/snack-bar/snack-bar.service';

export interface LocationDialogData {
  locationName: string;

  locationCategory: string;

  mode: DialogModes;
}

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form-dialog.component.html',
  styleUrls: ['./location-form-dialog.component.scss']
})
export class LocationFormDialogComponent implements OnInit {

  confirmation: string;
  latitude = 32;
  longitude = 34.78;


  selectedMarker: Coordinate = new Coordinate(this.latitude, this.longitude);

  categories: Category[] = [];


  selectedCategoryName: string;

  locationForm: FormGroup;
constructor(private formBuilder: FormBuilder,
            private categoryService: CategoryService,
            private locationService: LocationService,
            private dialogRef: MatDialogRef<LocationFormDialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: LocationDialogData,
            private translate: TranslateService,
            private snackBarService: SnackBarService) {
    this.createForm();
    switch (data.mode) {

      case DialogModes.Add:
        this.confirmation = this.translate.instant('LOCATION_DIALOG.ADD_LOCATION');
        break;
      case DialogModes.Edit:
        this.confirmation = this.translate.instant('LOCATION_DIALOG.EDIT_LOCATION');
        break;
    }
    this.categories = this.categoryService.getCategories().categories;
  }

  ngOnInit() {

    if (this.data.mode === DialogModes.Edit) {
      const response = this.locationService.getLocation(this.data.locationName);
      if (response.status) {
        this.snackBarService.showSnackBar(response.status);
        return;
        }
      const location = response.locations[0];
      this.updateForm(location);
    }
  }




  private createForm() {
    this.locationForm = this.formBuilder.group({
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
    this.dialogRef.close(location);
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
