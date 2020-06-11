import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-positionconvertion',
  templateUrl: './positionconvertion.component.html',
  styleUrls: ['./positionconvertion.component.scss']
})
export class PositionconvertionComponent implements OnInit {

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