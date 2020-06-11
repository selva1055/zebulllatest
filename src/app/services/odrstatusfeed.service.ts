import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OdrstatusfeedService {

  private subject: Rx.Subject<any>;

  constructor() { }
  public connect(url): Rx.Subject<any> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }
  private create(url): Rx.Subject<any> {
    let ws = new WebSocket(url);
    
    let observable = Rx.Observable.create(
      (obs: Rx.Observer<any>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      })
    let observer = {
      next: (feed: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(feed));
        }
      }
    }
    return Rx.Subject.create(observer, observable);
  }
}
