import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-mpin',
  templateUrl: './confirm-mpin.component.html',
  styleUrls: ['./confirm-mpin.component.scss']
})
export class ConfirmMpinComponent implements OnInit {

  private userInfo: any = {
    mpin: "",
    confirmMpin: "",
  };
  private errorMsg: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigate(to: string) {
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
  }

}
