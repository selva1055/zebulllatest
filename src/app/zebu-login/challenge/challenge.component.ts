import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

/* Feature Service */
import { ZebuLoginService } from '../services/zebu-login.service';

@Component({
  selector: 'zebu-login-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService
  ) {
    console.warn( "ChallengeComponent construction " );
    this.zebuLoginService.disableProgressBar();
  }

  ngOnInit() {
    console.warn( "ChallengeComponent initialisation " );
  }

  get challengeQuestions() {
    return this.zebuLoginService.challengeQuestions;
  }

  handleChallengeSubmit() {
    console.warn( "Harae kiya hum?" );
    /* If everything goes good then moving to home */
    this.router.navigateByUrl('home');
  }

  handleBackToIdentifierClick() {
    console.warn( "Move back to identifier beta" );
    this.zebuLoginService.enableProgressBar();
    this.router.navigate(
      ['/login/identifier'],
      { relativeTo: this.activatedRoute }
    );
  }

}
