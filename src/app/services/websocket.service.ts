import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  // Our socket connection
  private subject: Rx.Subject<any>;
  private ws;

  constructor() {
  }

  connect(url): Rx.Subject<any> {
    // if (!this.subject) {
    this.subject = this.create(url);
    // }
    return this.subject;
  }

  create(url): Rx.Subject<any> {
    this.ws = new WebSocket(url);
    let observable = Rx.Observable.create(
      (obs: Rx.Observer<any>) => {
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);
        return this.ws.close.bind(this.ws);
      })
    let observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    }
    return Rx.Subject.create(observer, observable);
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.subject = null;
    }
  }
}

