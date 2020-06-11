import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exitbracketorder',
  templateUrl: './exitbracketorder.component.html',
  styleUrls: ['./exitbracketorder.component.scss']
})
export class ExitbracketorderComponent implements OnInit {

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

