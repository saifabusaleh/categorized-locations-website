import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPaths } from '@enums/app-paths';

@Component({
  selector: 'app-bottom-toolbar',
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.scss']
})
export class BottomToolbarComponent implements OnInit {

  constructor(private router: Router) {
    //
  }

  ngOnInit() {
    //
  }

  onGoToCategories() {
    this.router.navigate(['/' + AppPaths.Categories], { replaceUrl: true });

  }

  onGoToLocations() {
    this.router.navigate(['/' + AppPaths.Locations], { replaceUrl: true });
  }

}
