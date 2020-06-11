import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zebulldoc',
  templateUrl: './zebulldoc.component.html',
  styleUrls: ['./zebulldoc.component.scss']
})
export class ZebulldocComponent implements OnInit {
  fixed: boolean;
  constructor() { }

  ngOnInit() {
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mainDiv").style.marginLeft = "250px";
  }

  checkBoxChange(evt) {
    let box = evt.target;
    if (box.id == 'chck1') {
      $("#chck2").prop('checked', false);
      $("#chck3").prop('checked', false);
      $("#chck4").prop('checked', false);
      $("#chck5").prop('checked', false);
      $("#chck6").prop('checked', false);
    } else if (box.id == 'chck2') {
      $("#chck1").prop('checked', false);
      $("#chck3").prop('checked', false);
      $("#chck4").prop('checked', false);
      $("#chck5").prop('checked', false);
      $("#chck6").prop('checked', false);
    } else if (box.id == 'chck3') {
      $("#chck1").prop('checked', false);
      $("#chck2").prop('checked', false);
      $("#chck4").prop('checked', false);
      $("#chck5").prop('checked', false);
      $("#chck6").prop('checked', false);
    } else if (box.id == 'chck4') {
      $("#chck1").prop('checked', false);
      $("#chck2").prop('checked', false);
      $("#chck3").prop('checked', false);
      $("#chck5").prop('checked', false);
      $("#chck6").prop('checked', false);
    }
    else if (box.id == 'chck7') {
      $("#chck1").prop('checked', false);
      $("#chck2").prop('checked', false);
      $("#chck3").prop('checked', false);
      $("#chck5").prop('checked', false);
      $("#chck4").prop('checked', false);
    }else if (box.id == 'chck8') {
      $("#chck1").prop('checked', false);
      $("#chck2").prop('checked', false);
      $("#chck3").prop('checked', false);
      $("#chck5").prop('checked', false);
      $("#chck4").prop('checked', false);
      $("#chck7").prop('checked', false);
    }
  }
}
