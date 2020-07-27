import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Model */
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from "@zebu-login/models/Route";

/* Feature Service */
import {
  ZebuLoginService,
} from '@zebu-login/services/zebu-login.service';

@Component({
  selector: 'zebu-login-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
export class IdentifierComponent implements OnInit, OnDestroy {

  private UserID: string = "";
  private zebuLoginStateSubscription: Subscription;
  private zebuLoginErrorSubscription: Subscription;
  private errorData: ErrorModel = {
    IsError: false,
    ErrorMsg: "",
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService
  ) { }

  ngOnInit() {
    /* Disabling loader */
    ZebuLoginService.disableProgressBar();

    /* Subscribing to zebuLoginService.zebuLoginState property */
    this.zebuLoginStateSubscription = ZebuLoginService
      .zebuLoginState
      .subscribe((value: string) => {
        console.warn("identifier, zebuLoginStateSubscription: ", value)
        console.warn(ZebuLoginService.loginData);
        if (
          value === LOGIN_STATE.PASSWORD_SECTION
          || value === LOGIN_STATE.MPIN_SECTION
        ) {
          const path = value === LOGIN_STATE.PASSWORD_SECTION
            ? ROUTEs.PASSWORD.path
            : ROUTEs.M_PIN.path;
          this.router.navigate(
            [`/${path}`],
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
    /* Getting UserID from url params */
    this.activatedRoute.params.subscribe(params => {
      /* Validating UserID in query params to update in component property*/
      const paramUserID = params['userid'];
      if (paramUserID && paramUserID.length > 0) {
        this.UserID = paramUserID;
      }
    });
  }

  ngOnDestroy(): void {
    this.zebuLoginStateSubscription.unsubscribe();
    this.zebuLoginErrorSubscription.unsubscribe();
  }

  onIdentifierSubmit() {
    const { UserID } = this;
    if (UserID.length >= 4 && new RegExp("^[a-zA-Z0-9]+$").test(UserID)) {
      ZebuLoginService.setErrorState(false, "");
      this.zebuLoginService.submitIdentifier(this.UserID);
      return;
    }
    ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_USER_ID);
  }

  navigate(to: string) {
    this.router.navigate(
      [`${to}`],
      { relativeTo: this.activatedRoute }
    );
  }
}
