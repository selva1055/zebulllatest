import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unblockuser',
  templateUrl: './unblockuser.component.html',
  styleUrls: ['./unblockuser.component.scss']
})
export class UnblockuserComponent implements OnInit {

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
