import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SortFilterMessage } from '../../components/filter/filter.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private myMessage = new Subject<string>();
  private sortFilterMessage = new Subject<SortFilterMessage>();

  constructor() { }

  getMessage(): Observable<string> {
    return this.myMessage.asObservable();
  }

  updateMessage(message: string) {
    this.myMessage.next(message);
  }

  getSortFilterMessage(): Observable<SortFilterMessage> {
    return this.sortFilterMessage.asObservable();
  }

  updateSortFilterMessage(message: SortFilterMessage) {
    this.sortFilterMessage.next(message);
  }
}

