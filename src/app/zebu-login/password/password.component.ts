import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  private userInfo: any = {
    userId: "ZA01001",
    password: "SleepingOwl@004",
  };

  private errorMsg: string = "Enter a valid User ID or Password"

  constructor() { }

  ngOnInit() {
  }

}
