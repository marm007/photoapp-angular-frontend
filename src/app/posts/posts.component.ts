import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../models/post';
import {PostsService} from '../services/post/posts.service';
import {MessageService} from '../services/message/message.service';
import {UserFollowed} from '../models/userFollowed';
import {AuthService} from '../services/auth/auth.service';
import {User} from '../models/user';
import {UserPosts} from '../models/userPosts';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
  private url = '';

  @Input()
  usersFollowed: UserFollowed[] = null;

  posts: Post[] = [];

  postsLoaded = false;

  message: string;

  userID: number;

  messageSubscription: Subscription;

  constructor(private postService: PostsService,
              private messageService: MessageService,
              private authService: AuthService) {
    console.log(messageService);
   /* this.messageSubscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'post_deleted') {
          this.postsLoaded.next(true);
        }
      });*/
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
      console.log('CAN DELETE');
      this.posts.splice(index, 1);
    }
  }

  async getPost(id: number): Promise<UserPosts> {
    return await new Promise<UserPosts>(resolve =>
      this.postService.getPosts(id)
        .subscribe(userPost => {
          const user: User = {username: userPost.username, profile: userPost.profile, id: userPost.id};
          userPost.posts.forEach(pos => {
            pos.user = JSON.parse(JSON.stringify(user));
            pos.image = this.url + pos.image;
            pos.user.profile.photo = this.url + pos.user.profile.photo;
          });
          resolve(userPost);
        }));
  }

  getPosts(): void {
    this.posts = [];
    const requests = [];

    this.usersFollowed.forEach((followed, index) => {
      requests.push(
        this.getPost(followed.followed).then(value => {
          this.posts = this.posts.concat(value.posts);
        }));
    });

    requests.push(
      this.getPost(this.authService.userID).then(value => {
      this.posts = this.posts.concat(value.posts);

    }));

    Promise.all(requests).then(() => {
      this.posts.sort(((a, b) => {
        if (a.created > b.created) { return -1; }
        if (a.created < b.created) { return 1; }
        return 0;
      }));
      this.postsLoaded = true;
      this.messageService.updateMessage('posts loaded');
    });
  }

}
