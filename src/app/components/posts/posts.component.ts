import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from '../../models/post';
import {PostsService} from '../../services/post/posts.service';
import {MessageService} from '../../services/message/message.service';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {Follower} from '../../models/follower';
import {forkJoin, Observable} from 'rxjs';
import {User} from '../../models/user';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  @Output()
  componentLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  usersFollowed: Follower[] = [];

  posts: Post[] = [];

  postsLoaded = false;

  message: string;

  userID: number;


  constructor(private postService: PostsService,
              private messageService: MessageService,
              private authService: AuthService,
              private userService: UserService) {
    this.userID = this.authService.userID;
  }

  ngOnInit(): void {
    this.getPosts();
  }

  ngOnDestroy() {
  }

  onPostDeleted(post: Post) {
    const index = this.posts.indexOf(post);
    if (index > -1) {
      this.posts.splice(index, 1);
    }
  }

  getPost(id: number): Observable<Post> {
    return this.postService.get(id);
  }

  getPosts(): void {
    const requests = [];
    console.log('HER I AM');
    if (this.usersFollowed !== undefined) {
      console.log('HER I AasdasadsM');
      this.usersFollowed.forEach((followed) => {
        requests.push(
          this.userService.get(followed.user_being_followed));
      });

      requests.push(this.userService.get(this.authService.userID));

      forkJoin(requests)
        .subscribe((users: User[]) => {
          const requestsUser = [];
          users.forEach(user => {
            user.posts.forEach((postID) => {
              requestsUser.push( this.getPost(postID));
            });
          });

          if (requestsUser.length === 0) {
            this.componentLoaded.emit(true);
            this.postsLoaded = true;
            this.messageService.updateMessage('posts loaded');
          }

          forkJoin(requestsUser)
            .subscribe((posts: Post[]) => {
              posts.sort(((a, b) => {
                if (a.created > b.created) {
                  return -1;
                }
                if (a.created < b.created) {
                  return 1;
                }
                return 0;
              }));
              this.posts = posts;
              this.componentLoaded.emit(true);
              this.postsLoaded = true;
              this.messageService.updateMessage('posts loaded');
            });
        });
    }
  }

}
