import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from '../../models/post';
import {PostsService} from '../../services/post/posts.service';
import {MessageService} from '../../services/message/message.service';
import {UserService} from '../../services/user/user.service';
import {ImageType, prepareImage} from '../../restConfig';


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


  constructor(private postService: PostsService,
              private messageService: MessageService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.listFollowedPosts();
  }

  ngOnDestroy() {
  }

  onPostDeleted(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  listFollowedPosts(start?: number, limit?: number): void {
    this.userService.listFollowedPosts(start, limit)
      .subscribe((posts: Post[]) => {
        if (!(start && limit)) {
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

}
