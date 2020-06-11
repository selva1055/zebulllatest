import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketwatchlist',
  templateUrl: './marketwatchlist.component.html',
  styleUrls: ['./marketwatchlist.component.scss']
})
export class MarketwatchlistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openNav() {
    console.log("asdasd");
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainDiv").style.marginLeft = "250px";
  }
  
  // closeNav() {
  //   document.getElementById("mySidenav").style.width = "0";
  // }

}