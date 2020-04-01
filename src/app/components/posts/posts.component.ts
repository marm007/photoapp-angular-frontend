import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post, PostFilterSortModel} from '../../models/post';
import {PostsService} from '../../services/post/posts.service';
import {MessageService} from '../../services/message/message.service';
import {UserService} from '../../services/user/user.service';
import {prepareImage} from '../../restConfig';
import {Subscription} from 'rxjs';
import {Filter, Sort} from '../filter/filter.component';

export interface FilterSortMessage {
  ordering: string;
  sorting: {created_after: string, created_before: string};
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  @Output()
  componentLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  posts: Post[] = [];

  postsLoaded = false;

  message: string;

  @Input()
  userID: number;

  messageSubscription: Subscription;
  messageFilterSubscription: Subscription;

  sortFilterMessage: PostFilterSortModel = {};

  constructor(private postService: PostsService,
              private messageService: MessageService,
              private userService: UserService) {
    this.messageFilterSubscription = this.messageService.getSortFilterMessage()
      .subscribe((message: Sort | Filter) => {
        if (message.isPost) {
          if ('dir' in message) {
            // sortowanie
            this.posts = [];
            this.sortFilterMessage.ordering = message.dir === 1 ? message.id : '-'.concat(message.id);
            this.listFollowedPosts(null, this.sortFilterMessage);
          } else {
            this.posts = [];
            this.sortFilterMessage.created_after = message.created_after;
            this.sortFilterMessage.created_before = message.created_before;
            this.listFollowedPosts(null, this.sortFilterMessage);
          }
        }
      });

    this.messageSubscription = this.messageService.getMessage()
      .subscribe(message => {
        if (message === 'reset_filter_true') {
          this.sortFilterMessage = {};
          this.posts = [];
          this.listFollowedPosts(null,  this.sortFilterMessage);
        }
      });
  }

  ngOnInit(): void {
    this.listFollowedPosts();
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
    this.messageFilterSubscription.unsubscribe();
  }

  onPostDeleted(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  listFollowedPosts(offset?: number, filters?: PostFilterSortModel): void {
    this.userService.listFollowedPosts(offset, filters)
      .subscribe((posts: Post[]) => {
        if (!offset) {
          this.componentLoaded.emit(true);
          this.postsLoaded = true;
          this.messageService.updateMessage('posts loaded');
        }
        posts.forEach(post => {
          post.user.meta.avatar = prepareImage(post.user.meta.avatar);
          post.image = prepareImage(post.image);

        });
        this.posts = this.posts.concat(posts);

      });
  }

  onScrolled() {
    this.listFollowedPosts(this.posts.length, this.sortFilterMessage);
  }

}
