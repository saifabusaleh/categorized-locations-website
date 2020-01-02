import { LocationStatusEnum, LocationResponse } from './../../model/location-response';
import { LocationService } from './../../services/location/location.service';
import { LocationFormComponent } from './../location-form/location-form.component';
import { DialogModes } from './../../model/dialog-modes';
import { AppPaths } from './../../model/app-paths';
import { Component, OnInit } from '@angular/core';
import { CategoryDialog } from 'src/app/dialogs/category-dialog/category-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Context } from 'src/app/model/context';
import { Category } from 'src/app/model/category';
import { CategoryResponse, CategoryStatusEnum } from 'src/app/model/category.response';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLocation } from 'src/app/model/location';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})


export class ToolbarComponent implements OnInit {

  isDeleteDisabled: boolean;

  isEditDisabled: boolean;
  isAddDisabled: boolean;


  title = '';



  menuAdd = 'Add';
  menuEdit = 'Edit';

  menuDelete = 'Delete';

  currentLocationOrCategoryName = '';

  CurrentContext: Context;

  urlSegments: string[];

  constructor(private _dialog: MatDialog,
    private _router: Router,
    private _categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private _locationService: LocationService) {

    this._router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.updateToolbarAfterRouting(event);
      }
    });
  }

  private updateToolbarAfterRouting(event: NavigationEnd) {
    this.urlSegments = event.url.split('/');
    if (this.urlSegments && this.urlSegments.length > 2) {
      if (this.urlSegments[1] === AppPaths.CategoryDetails) { 
        this.currentLocationOrCategoryName = this.urlSegments[2];
        this.updateUIWithContext(this.urlSegments[1]);
        return;
      }
      if (this.urlSegments[1] === AppPaths.Location) { 
        this.currentLocationOrCategoryName = this.urlSegments[3];
        this.updateUIWithContext(this.urlSegments[1]);
        return;
      }
    }
    this.updateUIWithContext(this.urlSegments[1]);
  }

  private updateUIWithContext(conString: string) {
    if (!conString) {
      conString = 'categories';
    }
    let con: Context = Context[conString];
    this.CurrentContext = con;
    switch (con) {
      case Context.locations:
      case Context.categories:
        this.title = conString;
        this.isAddDisabled = false;
        this.isEditDisabled = this.isDeleteDisabled = true;
        break;

      case Context.category:
        case Context.location:
        this.title = this.currentLocationOrCategoryName;
        this.isAddDisabled = true;
        this.isEditDisabled = this.isDeleteDisabled = false;
        break;
    }
  }
  ngOnInit() {
    //
  }

  private performAddCategory(categoryName: string) {
    if (categoryName) {
      this._categoryService.createCategory(new Category(categoryName)).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this.handleError(response.status, categoryName);
        }
      });
    }
  }

  private performUpdateCategory(newCategoryName: string) {
    if (newCategoryName) {
        this._categoryService.updateCategoryName(this.currentLocationOrCategoryName, newCategoryName).subscribe((response: CategoryResponse) => {
          if (response.status) {
            this.handleError(response.status, this.currentLocationOrCategoryName);
            return;
          }
          this._router.navigate(['/' + AppPaths.CategoryDetails + '/' + newCategoryName], { replaceUrl: true });
        });
    }
  }

  private performAddLocation(location: AppLocation) {
    if (location) {
      this._locationService.createLocation(location).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, `Category ${location.category} not found!`);
        }
      });
    }
  }

  private performUpdateLocation(newLocation: AppLocation) {
    if (newLocation) {
        this._locationService.updateLocation(this.currentLocationOrCategoryName, this.urlSegments[2], newLocation).subscribe((response: LocationResponse) => {
          if (response.status) {
            this.handleError(response.status, this.currentLocationOrCategoryName);
            return;
          }
          this._router.navigate(['/' + AppPaths.Location + '/' + this.urlSegments[2] + '/' + this.currentLocationOrCategoryName]);
        });
    }
  }
  onAdd() {
    let dialogRef;
    switch (this.CurrentContext) {
      case Context.categories:
        dialogRef = this.openCategoryDialog(DialogModes.Add);
        dialogRef.afterClosed().subscribe(categoryName => {
          this.performAddCategory(categoryName);
        });
        break;

      case Context.locations:
        dialogRef = this.openLocationDialog(DialogModes.Add);
        dialogRef.afterClosed().subscribe((location: AppLocation) => {
          this.performAddLocation(location);
        });
        break;
    }
  }
  openCategoryDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(CategoryDialog, {
      width: '260px',
      data: { categoryName: '', mode: modeInput }
    });
    return dialogRef;
  }

  openLocationDialog(modeInput: DialogModes) {
    const dialogRef = this._dialog.open(LocationFormComponent, {
      data: { locationName: this.currentLocationOrCategoryName, locationCategory: this.urlSegments[2] , mode: modeInput },
      width: '500px'
    });
    return dialogRef;
  }

  onEdit() {
    let dialogRef;
    switch (this.CurrentContext) {
      case Context.category:
        dialogRef = this.openCategoryDialog(DialogModes.Edit);
        dialogRef.afterClosed().subscribe(categoryName => {
          this.performUpdateCategory(categoryName);
        });
        break;
      case Context.location:
        dialogRef = this.openLocationDialog(DialogModes.Edit);
        dialogRef.afterClosed().subscribe((location: AppLocation) => {
          this.performUpdateLocation(location);
        });
        break;
    }
  }

  onDelete() {
    switch (this.CurrentContext) {
      case Context.category:
        this.performDeleteCategory();
        break;
      case Context.location:
        this.performDeleteLocation();
        break;

    }
  }

  private performDeleteCategory() {

      this._categoryService.deleteCategory(this.currentLocationOrCategoryName).subscribe((response: CategoryResponse) => {
        if (response.status) {
          this.handleError(response.status, this.currentLocationOrCategoryName);
          return;
        }
        this._router.navigate(['/']);
      });
  }

  private performDeleteLocation() {
      this._locationService.deleteLocation(this.currentLocationOrCategoryName, this.urlSegments[2]).subscribe((response: LocationResponse) => {
        if (response.status) {
          this.handleError(response.status, this.currentLocationOrCategoryName);
          return;
        }
        this._router.navigate(['/' + AppPaths.Locations]);
      });
  }


  private showSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 7000,
    });
  }

  private handleError(status: CategoryStatusEnum | LocationStatusEnum, parameter?: string) {
    this.showSnackBar(status.replace('{0}', parameter));

    this._router.navigate(['/']);
  }
}
