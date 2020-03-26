import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private myMessage = new Subject<string>();

  constructor() { }

  getMessage(): Observable<string> {
    return this.myMessage.asObservable();
  }

  updateMessage(message: string) {
  this.myMessage.next(message);
}
}

