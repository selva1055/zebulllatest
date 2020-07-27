import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature animation */
import { slideInAnimation } from "./route/zebu-login-route-animation";
/* Feature Service */
import { ZebuLoginService } from './services/zebu-login.service';

@Component({
  selector: 'app-zebu-login',
  templateUrl: './zebu-login.component.html',
  styleUrls: [
    './zebu-login.component.scss',
  ],
  animations: [slideInAnimation]
})
export class ZebuLoginComponent implements OnInit, OnDestroy {
  data = {
    title: "zebull WEB",
    subtitle: "Zebu's web trading platform",
    version: "version 1.0.9",
    company: {
      name: "Zebu share and wealth managements private limited",
      info: [
        "SEBI Registration No: INZ000174634",
        "CDSL: 12080400 | AMFI ARN: 113118",
        "Research Analyst: INH200006044"
      ],
      address: [
        "127, 1st floor, PSK Booshanam Mahal",
        "Velachery, Chennai - 600 042"
      ]
    },
    options: [
      "NSE", "BSE", "MCX", "SEBI"
    ],
  };
  private isLoadingSubscription: Subscription;
  private isLoading: Boolean;
  constructor() { }

  ngOnInit() {
    /* Subscribing to zebuLoginService.isAuthenticatedUser property */
    this.isLoadingSubscription = ZebuLoginService.isLoading
      .subscribe((value: boolean) => {
        this.isLoading = value;
      });
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
  }

  getState(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
