import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mpin',
  templateUrl: './mpin.component.html',
  styleUrls: ['./mpin.component.scss']
})
export class MpinComponent implements OnInit {

  private userInfo: any = {
    userId: "ZA01001",
    mpin: "123456",
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

  onSubmit() {
    console.warn("Handle it bro!!");
  }

}
