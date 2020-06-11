import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';


@Component({
  selector: 'app-dialog-logout',
  templateUrl: './dialog-logout.component.html',
  styleUrls: ['./dialog-logout.component.scss']
})
@Injectable()

export class DialogLogoutComponent implements OnInit {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogLogoutComponent>,
    public odgenserv: ZebuodrGentrService,
    public routeTo: Router,
    private wsService: WebsocketService,
    public odrServ: ZebuodrGentrService, ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  logout() {
    this.odrServ.zebuLogout().subscribe(res => {
      this.socketConnectionClose();
      localStorage.clear();
      if (res["stat"] == "Ok") {
        // localStorage.clear();
        this.wsService.close();
        this.dialogRef.close(true);
      } else if (res["emsg"] == "Session Expired") {
        // localStorage.clear();
        this.wsService.close();
        this.dialogRef.close(true);
      }
    }, (err) => {
      if (err.error == "Unauthorized") {
        this.dialogRef.close(true);
      }
    });
  }


  socketConnectionClose() {
    var jsonSendObj = {
      "channel": "",
      "task": "",
      "acctid": this.odgenserv.getUserId(),
      "user": this.odgenserv.getUserId(),
      "token": this.odgenserv.getSessionToken()
    };
    this.odgenserv.mWatch.next(jsonSendObj);
  }
}

