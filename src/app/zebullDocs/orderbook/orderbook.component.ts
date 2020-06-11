import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss']
})
export class OrderbookComponent implements OnInit {

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
