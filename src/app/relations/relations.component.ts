import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import * as data from '../relations_data.json';
import {PostsService} from '../services/post/posts.service';
import {MessageService} from '../services/message/message.service';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  message: string = null;

  // @ts-ignore
  relations = data.default;

  postsLoaded: Subject<boolean> = new Subject();

  constructor(private messageService: MessageService) {
    console.log(this.relations);
    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'posts loaded') {
          this.postsLoaded.next(true);
        }
        this.message = myMessage;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
