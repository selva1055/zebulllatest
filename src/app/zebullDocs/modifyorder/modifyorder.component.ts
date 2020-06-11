import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modifyorder',
  templateUrl: './modifyorder.component.html',
  styleUrls: ['./modifyorder.component.scss']
})
export class ModifyorderComponent implements OnInit {

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
