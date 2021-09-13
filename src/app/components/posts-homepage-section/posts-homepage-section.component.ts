import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post, PostFilterSortModel } from '../../models/post';
import { prepareImage } from '../../restConfig';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { SortFilterMessage } from '../filter/filter.component';

export interface FilterSortMessage {
  ordering: string;
  sorting: { created_after: string, created_before: string };
}

@Component({
  selector: 'app-posts-homepage-section',
  templateUrl: './posts-homepage-section.component.html',
  styleUrls: ['./posts-homepage-section.component.css']
})
export class PostsHomepageSectionComponent implements OnInit, OnDestroy {

  @Output()
  componentLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();


  @Input()
  userID: string;

  posts: Post[] = [];

  postsLoaded = false;

  message: string;

  messageSubscription: Subscription;
  messageFilterSubscription: Subscription;

  sortFilterMessage: PostFilterSortModel = {};

  constructor(
    private messageService: MessageService,
    private userService: UserService) {
    this.messageFilterSubscription = this.messageService
      .getSortFilterMessage()
      .subscribe((message: SortFilterMessage) => {
        if (message.isPost) {
          if (message.sort) {
            // sortowanie
            this.posts = [];
            this.sortFilterMessage.ordering = message.sort.dir === 1 ? message.sort.id : '-'.concat(message.sort.id);
            this.loadInitialPosts(0, this.sortFilterMessage);
          } else if (message.filter) {
            this.posts = [];
            this.sortFilterMessage.created_after = message.filter.created_after;
            this.sortFilterMessage.created_before = message.filter.created_before;
            this.loadInitialPosts(0, this.sortFilterMessage);
          } else {
            this.posts = [];
            if (message.likesSort.likes__gt != null) {
              if (message.likesSort.likesGtClicked) {
                this.sortFilterMessage.likes__gt = message.likesSort.likes__gt;
              } else {
                delete this.sortFilterMessage.likes__gt;
              }
            } else { delete this.sortFilterMessage.likes__gt; }
            if (message.likesSort.likes__lt != null) {
              if (message.likesSort.likesLtClicked) {
                this.sortFilterMessage.likes__lt = message.likesSort.likes__lt;
              } else {
                delete this.sortFilterMessage.likes__lt;
              }
            } else { delete this.sortFilterMessage.likes__lt; }
            this.loadInitialPosts(0, this.sortFilterMessage);
          }
        }
      });

    this.messageSubscription = this.messageService.getMessage()
      .subscribe(message => {
        if (message === 'reset_filter_true') {
          this.sortFilterMessage = {};
          this.posts = [];
          this.loadInitialPosts(0, this.sortFilterMessage);
        }
      });
  }

  ngOnInit(): void {
    this.loadInitialPosts();
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

  loadInitialPosts(offset?: number, filters?: PostFilterSortModel): void {
    this.userService
      .listFollowedPosts(offset, filters)
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

        this.posts = posts

      });
  }

  onScrolled() {
    if (!this.postsLoaded) return

    this.userService
      .listFollowedPosts(this.posts.length, this.sortFilterMessage)
      .subscribe((posts: Post[]) => {
        this.messageService.updateMessage('posts loaded');
        posts.forEach(post => {
          post.user.meta.avatar = prepareImage(post.user.meta.avatar);
          post.image = prepareImage(post.image);
        });

        this.posts = [...this.posts, ...posts]

      });
  }

}
