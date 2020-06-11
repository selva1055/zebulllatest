import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';

@Component({
  selector: 'app-postioninfo',
  templateUrl: './postioninfo.component.html',
  styleUrls: ['./postioninfo.component.scss']
})
export class PostioninfoComponent implements OnInit {
  info: any;
  userId: any

  constructor(
    public dialogRef: MatDialogRef<PostioninfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public odgenserv: ZebuodrGentrService,
  ) {
    this.info = data['data'];
    console.log(this.info);
    this.userId = this.odgenserv.getUserId();
  }

  ngOnInit() {
  }
  closeModelBox(): void {
    this.dialogRef.close();
  }
}
