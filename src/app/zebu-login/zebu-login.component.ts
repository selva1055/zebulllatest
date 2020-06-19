import {
  Component,
  OnInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/* Feature Service */
import { ZebuLoginService } from './services/zebu-login.service';

@Component({
  selector: 'app-zebu-login',
  templateUrl: './zebu-login.component.html',
  styleUrls: ['./zebu-login.component.scss']
})
export class ZebuLoginComponent implements OnInit {
  data = {
    title: "zebull",
    subtitle: "zebu's web trading platform",
    company: {
      name: "Zebu share and wealth managements pvt ltd",
      address: [
        "127, 1st floor, PSK Booshanam Mahal",
        "Velachery, Chennai - 600 042"
      ]
    },
    loginOptions: [
      {
        label: "Back to login",
        path: "/login/identifier"
      },
      {
        label: "Unblock user",
        path: "/login/unblock"
      },
      {
        label: "Forgot password",
        path: "/login/forgot"
      }
    ],
    features: [
      "Order Generator",
      "CoEarn",
      "API Documentation"
    ],
    options: [
      "NSE", "BSE", "MCX", "SEBI", "Risk Disclosure", "Security",
      "Terms and Conditions"
    ],
  };
  // private isLoading: Boolean = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService,
  ) {}

  ngOnInit() {}

  get loginOptions() {
    return this.data.loginOptions.filter(
      loginOption => loginOption.path != this.router.url
    );    
  }

  get isLoading() {
    return this.zebuLoginService.isLoading;
  }

  handleActionLink( loginOption: LoginOptionInterface ) {
    this.router.navigate(
      [loginOption.path],
      { relativeTo: this.activatedRoute }
    );
  }
}

interface LoginOptionInterface {
  path: string,
  label: string;
}