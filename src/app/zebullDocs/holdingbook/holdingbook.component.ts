import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-holdingbook',
  templateUrl: './holdingbook.component.html',
  styleUrls: ['./holdingbook.component.scss']
})
export class HoldingbookComponent implements OnInit {

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