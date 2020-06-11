import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-squareofposition',
  templateUrl: './squareofposition.component.html',
  styleUrls: ['./squareofposition.component.scss']
})
export class SquareofpositionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainDiv").style.marginLeft = "250px";
  }
}
