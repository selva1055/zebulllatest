import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deletescrips',
  templateUrl: './deletescrips.component.html',
  styleUrls: ['./deletescrips.component.scss']
})
export class DeletescripsComponent implements OnInit {

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