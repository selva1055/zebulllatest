import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  private userInfo: any = {
    userId: "",
    pan: "",
    email: "",
    dob: "",
  };

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

  handleUnblock(event: any) {
    console.warn(
      "Handle password reset bruh: ",
      this.userInfo,
    );
  }

}
