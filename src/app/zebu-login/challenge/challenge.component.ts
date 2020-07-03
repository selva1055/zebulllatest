import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, from } from 'rxjs';

/* Feature Model */
import { ROUTEs } from "../models/Route";

/* Feature Service */
import { ZebuLoginService, CHALLENGE_RESPONSE } from '../services/zebu-login.service';

@Component({
  selector: 'zebu-login-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {

  userId: string;
  answers: string[] = ["", ""];
  private challengeNavigationStateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService
  ) {
    console.warn("ChallengeComponent construction ");
    this.zebuLoginService.disableProgressBar();
  }

  ngOnInit() {
    /* Getting UserID from url params */
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userid'] && params['userid'].length > 0
        ? params['userid'] : "";
    });

    /* Subscribing to zebuLoginService.challengeNavigationState property */
    this.challengeNavigationStateSubscription = this.zebuLoginService
      .challengeNavigationState
      .subscribe((value: string) => {

        console.warn("challengeNavigationStateSubscription: ", value)
        /**
         * Validating user has to reset their password and
         * then they have to submit new mpin before moving to home
         * */
        if (value === CHALLENGE_RESPONSE.RESET_AND_HOME) {
          this.router.navigate(
            [`/${ROUTEs.PASSWORD_RESET.path}`, { userid: this.userId }],
            { relativeTo: this.activatedRoute }
          );
          return;
        }

        console.warn(value)

        /* Validating is user goog to move to setting mpin for further login */
        if (value === CHALLENGE_RESPONSE.HOME) {
          console.warn("Moving to home...");
          this.router.navigate(
            [`/${ROUTEs.CONFIRM_M_PIN.path}`, { userid: this.userId }],
            { relativeTo: this.activatedRoute }
          );
          return;
        }
      });
  }

  ngOnDestroy(): void {
    this.challengeNavigationStateSubscription.unsubscribe();
  }

  get challengeQuestions() {
    return this.zebuLoginService.challengeQuestions;
  }

  handleChallengeSubmission() {
    console.warn("Harae kiya hum?");
    this.zebuLoginService.enableProgressBar();
    this.zebuLoginService.validateTwoFactorAuthentication(
      this.answers,
      this.userId,
    );
  }

  handleBackToIdentifierClick() {
    console.warn("Move back to identifier beta");
    this.zebuLoginService.enableProgressBar();
    this.router.navigate(
      ['/login/identifier'],
      { relativeTo: this.activatedRoute }
    );
  }

}
