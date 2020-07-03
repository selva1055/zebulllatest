import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/* Feature Service */
import { ZebuLoginService } from '../services/zebu-login.service';

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
    private zebuLoginService: ZebuLoginService,
  ) { }

  ngOnInit() {
    /* Disabling loader */
    this.zebuLoginService.disableProgressBar();
  }

  navigate(to: string) {
    /* Enabling loader */
    this.zebuLoginService.enableProgressBar();
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
  }

}
