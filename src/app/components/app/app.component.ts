import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor() {
    //
  }

  ngOnInit(): void {

    let map: Map<string, string> = new Map();
    map.set('1','2');
    map.set('2','1');

    localStorage.map =  JSON.stringify(Array.from(map.entries()));

    let oooo = new Map(JSON.parse(localStorage.getItem('map')));

 //
  }

}
