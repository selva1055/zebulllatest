import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save2fa',
  templateUrl: './save2fa.component.html',
  styleUrls: ['./save2fa.component.scss']
})
export class Save2faComponent implements OnInit {

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