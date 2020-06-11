import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketorder',
  templateUrl: './marketorder.component.html',
  styleUrls: ['./marketorder.component.scss']
})
export class MarketorderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openNav() {
    console.log("asdasd");
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainDiv").style.marginLeft = "250px";
  }
}
