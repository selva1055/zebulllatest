import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-positionbook',
  templateUrl: './positionbook.component.html',
  styleUrls: ['./positionbook.component.scss']
})
export class PositionbookComponent implements OnInit {

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