import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SharedataserviceService {


  private messageSrc = new BehaviorSubject<any>("");
  private refreshsocket = new BehaviorSubject<any>(false);
  private reconntionSocket = new BehaviorSubject<any>(false);
  public executeOrderShare = new BehaviorSubject<any>("");
  public autoTriggerPosition = new BehaviorSubject<Boolean>(false);
  public pinkedBasketData = new BehaviorSubject<Boolean>(false);
  public pinkedOrdersEdit = new BehaviorSubject<Boolean>(false);
  public indexDataShare = new BehaviorSubject<any>("");
  public indexBasketDataShare = new BehaviorSubject<any>("");
  public backToHome = new BehaviorSubject<Boolean>(false);
  reconnectSocketConnection = this.reconntionSocket.asObservable();
  refreshsocketcall = this.refreshsocket.asObservable();
  currentMsg = this.messageSrc.asObservable();
  ordersEdit = this.pinkedOrdersEdit.asObservable();
  ordersMsgShare = this.executeOrderShare.asObservable();
  autoTrigger = this.autoTriggerPosition.asObservable();
  pinkedBasketCall = this.pinkedBasketData.asObservable();
  indexTickDataObservable = this.indexDataShare.asObservable();
  indexBasketDataShareObservable = this.indexDataShare.asObservable();
  backToChartToHome = this.backToHome.asObservable();
  public orderplaced: Boolean = true;
  constructor() { }

  broadcastData(id, data: any) {
    var sharedata = {
      "id": id,
      "data": data
    }
    this.messageSrc.next(sharedata)
  }

  reconnectSocket(response) {
    // console.log(response)
    this.reconntionSocket.next(response);
  }

  indexTickData(jsonobj) {
    this.indexDataShare.next(jsonobj);
  }

  shareBasketData(jsonobj: any) {
    // console.log("Share Basket Data", jsonobj)
    var pinked: boolean = true;
    this.indexBasketDataShare.next(jsonobj);
    this.pinkedBasketData.next(pinked);
  }

  excuteOrders(placeOdr: Boolean) {
    this.executeOrderShare.next(placeOdr);
  }

  autoRefresh(value: Boolean){
    this.autoTriggerPosition.next(value);
  }
  refreshSocketConnCall(value: Boolean) {
    this.refreshsocket.next(value);
  }

  ordersEditer(res: Boolean) {
    this.pinkedOrdersEdit.next(res);
  }

  goToBackHomePageMobileView(response) {
    // setTimeout(() => {
    console.log(response)
    this.backToHome.next(response)
    // }, 500);
  }

}
