import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Model */
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from "@zebu-login/models/Route";

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';

@Component({
  selector: 'zebu-login-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {

  userId: string;
  answers: string[] = ["", ""];
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
  ) {
    console.warn("ChallengeComponent construction ");
    ZebuLoginService.disableProgressBar();
    /* Getting UserID from service */
    this.userId = ZebuLoginService.loginData.UserID;
  }

  ngOnInit() {
    /* Subscribing to zebuLoginService.zebuLoginState property */
    this.zebuLoginStateSubscription = ZebuLoginService
      .zebuLoginState
      .subscribe((value: string) => {

        console.warn("challenge, zebuLoginStateSubscription: ", value)
        /**
         * Validating user has to renew their password
         * */
        if (value === LOGIN_STATE.RENEW_AND_HOME
          || value === LOGIN_STATE.RENEW_AND_MPIN
        ) {
          this.router.navigate(
            [`/${ROUTEs.PASSWORD_RENEW.path}`, { userid: this.userId }],
            { relativeTo: this.activatedRoute }
          );
          return;
        }

        /* Validating is user move to setting mpin to move into home */
        if (value === LOGIN_STATE.MPIN_AND_HOME) {
          console.warn("Moving to mpin...");
          this.router.navigate(
            [`/${ROUTEs.CONFIRM_M_PIN.path}`, { userid: this.userId }],
            { relativeTo: this.activatedRoute }
          );
          return;
        }

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

  get challengeQuestions() {
    if (ZebuLoginService.loginData.TwoFactor.splittedSQuestion) {
      return ZebuLoginService.loginData.TwoFactor.splittedSQuestion;
    }
    return [];
  }

  handleChallengeSubmission() {
    const { answers } = this;
    if (answers.length === 2 && answers[0].length >= 1 && answers[1].length >= 1) {
      ZebuLoginService.enableProgressBar();
      this.zebuLoginService.validateTwoFactorAuthentication(
        this.answers,
        this.userId,
      );
      return;
    }
    ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_CREDENTIALS);
  }

  navigate() {
    ZebuLoginService.enableProgressBar();
    this.router.navigate(
      ['/login'],
    );
  }

}
