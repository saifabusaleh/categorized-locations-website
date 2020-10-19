import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModes } from 'src/app/shared/dialog-modes';
import { Category } from 'src/app/categories/category';
import { AppLocation, Coordinate } from 'src/app/locations/location';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/categories/category.service';
import { LocationService } from 'src/app/locations/location.service';
import { SnackBarService } from 'src/app/shared/snack-bar.service';


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
  constructor(
    private formBuilder: FormBuilder,
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

  onConfirm() {
    const location: AppLocation = new AppLocation(this.locationForm.get('locationName').value,
      this.locationForm.get('locationAddress').value, this.selectedMarker,
      this.locationForm.get('selectedCategory').value);
    this.dialogRef.close(location);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
