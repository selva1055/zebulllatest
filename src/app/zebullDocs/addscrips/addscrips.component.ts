import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addscrips',
  templateUrl: './addscrips.component.html',
  styleUrls: ['./addscrips.component.scss']
})
export class AddscripsComponent implements OnInit {

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
