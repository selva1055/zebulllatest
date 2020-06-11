import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validate2fa',
  templateUrl: './validate2fa.component.html',
  styleUrls: ['./validate2fa.component.scss']
})
export class Validate2faComponent implements OnInit {

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
  //   document.getElementById("mainDiv").style.marginLeft = "0";
  // }

}
