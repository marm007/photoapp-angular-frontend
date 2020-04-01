import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Filter, Sort} from '../../components/filter/filter.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private myMessage = new Subject<string>();
  private sortFilterMessage = new Subject<Sort | Filter>();

  constructor() { }

  getMessage(): Observable<string> {
    return this.myMessage.asObservable();
  }

  updateMessage(message: string) {
  this.myMessage.next(message);
  }

  getSortFilterMessage(): Observable<Sort | Filter> {
    return this.sortFilterMessage.asObservable();
  }

  updateSortFilterMessage(message: Sort | Filter) {
  this.sortFilterMessage.next(message);
  }
}

