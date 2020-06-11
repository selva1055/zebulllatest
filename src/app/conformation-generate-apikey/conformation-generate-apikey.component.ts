import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../indexlist/indexlist.component';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
@Component({
  selector: 'app-conformation-generate-apikey',
  templateUrl: './conformation-generate-apikey.component.html',
  styleUrls: ['./conformation-generate-apikey.component.scss']
})
export class ConformationGenerateApikeyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConformationGenerateApikeyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public odgenserv: ZebuodrGentrService, ) { }

  ngOnInit() {
  }

  closeAPIGenerate() {
    this.dialogRef.close();
  }

  generateApiKey() {
    var jsonData = {}
    this.odgenserv.generateAPIKey(jsonData).subscribe(res => {
      if (res['emsg'] == 'SUCCESS') {
        this.dialogRef.close(true);
      }
    },
      (err) => {
        console.log(err.error)
      });
  }

}
