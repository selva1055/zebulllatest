import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bracketorder',
  templateUrl: './bracketorder.component.html',
  styleUrls: ['./bracketorder.component.scss']
})
export class BracketorderComponent implements OnInit {

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
