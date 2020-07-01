import {
  Component,
  OnInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/* Feature animation */
import { slideInAnimation } from "./zebu-login-route-animation";
/* Feature Service */
import { ZebuLoginService } from './services/zebu-login.service';

@Component({
  selector: 'app-zebu-login',
  templateUrl: './zebu-login.component.html',
  styleUrls: [
    './zebu-login.component.scss',// Style for main component
  ],
  animations: [slideInAnimation]
})
export class ZebuLoginComponent implements OnInit {
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
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService,
  ) { }

  ngOnInit() { }

  get isLoading() {
    return this.zebuLoginService.isLoading;
  }
}
