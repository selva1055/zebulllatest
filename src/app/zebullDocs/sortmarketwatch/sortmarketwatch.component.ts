import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sortmarketwatch',
  templateUrl: './sortmarketwatch.component.html',
  styleUrls: ['./sortmarketwatch.component.scss']
})
export class SortmarketwatchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openNav() {
    console.log("asdasd");
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainDiv").style.marginLeft = "250px";
  }
  
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

}