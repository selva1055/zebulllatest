import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-getlimits',
  templateUrl: './getlimits.component.html',
  styleUrls: ['./getlimits.component.scss']
})
export class GetlimitsComponent implements OnInit {

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