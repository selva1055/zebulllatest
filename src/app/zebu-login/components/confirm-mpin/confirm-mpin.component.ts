import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from '@zebu-login/models/Route';

@Component({
  selector: 'app-confirm-mpin',
  templateUrl: './confirm-mpin.component.html',
  styleUrls: ['./confirm-mpin.component.scss']
})
export class ConfirmMpinComponent implements OnInit, OnDestroy {

  private userInfo: any = {
    mpin: "",
    confirmMPin: "",
  };
  private zebuLoginStateSubscription: Subscription;
  private zebuLoginErrorSubscription: Subscription;
  private errorData: ErrorModel = {
    IsError: false,
    ErrorMsg: "",
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService,
  ) { }

  ngOnInit() {
    /* Disabling loader */
    ZebuLoginService.disableProgressBar();
    /* Subscribing to zebuLoginService.zebuLoginState property */
    this.zebuLoginStateSubscription = ZebuLoginService
      .zebuLoginState
      .subscribe((value: string) => {
        if (value === LOGIN_STATE.HOME) {
          this.router.navigate(
            [`/home`],
            { relativeTo: this.activatedRoute }
          );
        }
      });
    /* Subscribing to error data */
    this.zebuLoginErrorSubscription = ZebuLoginService
      .errorState
      .subscribe((value: ErrorModel) => {
        if (value.IsError) {
          /* Disabling upon error */
          ZebuLoginService.disableProgressBar();
          /* Updating local data */
          this.errorData = value;
        }
      });
  }

  ngOnDestroy(): void {
    this.zebuLoginStateSubscription.unsubscribe();
    this.zebuLoginErrorSubscription.unsubscribe();
  }

  navigate(to: string) {
    /* Enabling loader */
    ZebuLoginService.enableProgressBar();
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
  }

  onSubmit() {
    const { mpin, confirmMPin } = this.userInfo

    /* Validate whether user entered input or not */
    if (mpin.length === 0) {
      ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_CREDENTIALS);
      return;
    }

    /* Validating PIN equality */
    if (mpin !== confirmMPin) {
      ZebuLoginService.setErrorState(true, ErrorConstant.MIS_MATCHING_CREDENTIALS);
      return;
    }

    ZebuLoginService.enableProgressBar();
    this.zebuLoginService.submitNewMPin(mpin);
  }

}
