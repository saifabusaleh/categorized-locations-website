import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPaths } from '@models/app-paths';

@Component({
  selector: 'app-bottom-toolbar',
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.scss']
})
export class BottomToolbarComponent implements OnInit {

  constructor(private _router: Router) { 
    //
  }

  ngOnInit() {
    //
  }

  onGoToCategories() {
    this._router.navigate(['/'+ AppPaths.Categories], { replaceUrl: true });

  }

  onGoToLocations() {
    
    this._router.navigate(['/' + AppPaths.Locations], { replaceUrl: true });

  }

}
