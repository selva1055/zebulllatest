import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketwatchscrips',
  templateUrl: './marketwatchscrips.component.html',
  styleUrls: ['./marketwatchscrips.component.scss']
})
export class MarketwatchscripsComponent implements OnInit {

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