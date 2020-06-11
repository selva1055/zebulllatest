import { Component, OnInit, Inject } from '@angular/core';
// import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';
// import { MatBottomSheetRef} from '@angular/material/bottom-sheet';
// import { AppComponent } from '../app.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { WebsocketService } from '../services/websocket.service';


export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-indexlist',
  templateUrl: './indexlist.component.html',
  styleUrls: ['./indexlist.component.scss']
})
export class IndexlistComponent implements OnInit {
  indexNames: any = [];
  value: number;
  positions: any;
  niftyname: any;
  senxname: any;
  commonServ: any;

  constructor(public dialogRef: MatDialogRef<IndexlistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public websocket: WebsocketService,
    public odgenserv: ZebuodrGentrService,
  ) {
  }

  ngOnInit() {
    // var indexlist: any = JSON.parse(localStorage.getItem("indexnamelist"));
    this.niftyname = this.data['nifname'];
    this.senxname = this.data['senxname'];
    this.positions = this.data['position'];
    this.positions = JSON.parse(localStorage.getItem("indexnamelist"));
    var indexlist: any = this.data['idxList'];
    for (let index of indexlist) {
      if (this.positions > 0) {
        if (index['IndexName'] != this.niftyname) {
          this.indexNames.push(index);
        }
      } else {
        if (index['IndexName'] != this.senxname) {
          this.indexNames.push(index);
        }
      }
    }
  }

  /**
  * @method methed to set Index value
  * @params --
  * @return --
  * @author Dhivya 
  * @on 30/09/2019
  */
  setIndexObject(object) {
    this.dialogRef.close(object);
    if (this.positions == 0) {
      let jsonObj = {
        user_id: this.odgenserv.getUserId(),
        position: 1,
        index_name: object.IndexName,
        exch_seg: name == 'SENSEX' ? 'bse_cm' : 'nse_cm',
      }
      this.odgenserv.getIndex(jsonObj).subscribe(resp => {
        if (resp['stat'] == 'SUCCESS') {
          this.dialogRef.close(object);
        }
      })
    } else {
      let jsonObj = {
        user_id: this.odgenserv.getUserId(),
        position: 2,
        index_name: object.IndexName,
        exch_seg: name == 'SENSEX' ? 'bse_cm' : 'nse_cm',
      }
      this.odgenserv.getIndex(jsonObj).subscribe(resp => {
        if (resp['stat'] == 'SUCCESS') {
          this.dialogRef.close(object);
        }
      })
    }
    (err) => {
      if(err.error == "Unauthorized"){
        this.websocket.close();
        this.dialogRef.close();
      }
      console.log(err);
    }
  }
}










  //     } else {
  //       this.nifname = result['IndexName'];
  //       this.nifindexVal = result['IndexValue'];
  //       this.nifindexChange = (Number(result['IndexChange']) / 100).toFixed(2);
  //     }
  //   });
  //   // }, 1000);


//