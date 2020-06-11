import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scripsdetails',
  templateUrl: './scripsdetails.component.html',
  styleUrls: ['./scripsdetails.component.scss']
})
export class ScripsdetailsComponent implements OnInit {

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