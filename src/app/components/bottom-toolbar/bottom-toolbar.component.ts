import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPaths } from 'src/app/model/app-paths';

@Component({
  selector: 'app-bottom-toolbar',
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.scss']
})
export class BottomToolbarComponent implements OnInit {

  categoriesText = 'Categories';
  locationsText = 'Locations';
  constructor(private _router: Router) { 
    //
  }

  ngOnInit() {
    //
  }

  goToCategories() {
    this._router.navigate(['/'], { replaceUrl: true });

  }

  goToLocations() {
    
    this._router.navigate(['/' + AppPaths.Locations], { replaceUrl: true });

  }

}
