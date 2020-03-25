import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../models/post';
import {PostsService} from '../services/post/posts.service';
import {MessageService} from '../services/message/message.service';
import {UserFollowed} from '../models/userFollowed';
import {AuthService} from '../services/auth/auth.service';
import {User} from '../models/user';
import {UserRelations} from '../models/userRelations';
import {UserPosts} from '../models/userPosts';


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

  constructor(private postService: PostsService,
              private messageService: MessageService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getPosts();
  }

  ngOnDestroy() {
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
      this.getPost(this.authService.userId).then(value => {
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

  getPost1s(): void {
      let itemsProcessed = 0;
      this.usersFollowed.forEach((followed, index) => {
        this.postService.getPosts(followed.followed)
          .subscribe(followedData => {
            const user: User = {username: followedData.username, profile: followedData.profile, id: followedData.id };
            followedData.posts.forEach(post => post.user = JSON.parse(JSON.stringify(user)));
            this.posts = this.posts.concat(followedData.posts);
            itemsProcessed++;
            if (itemsProcessed === this.usersFollowed.length) {
              this.postService.getPosts(this.authService.userId)
                .subscribe(myData => {
                  const myUser: User = {username: myData.username, profile: myData.profile, id: myData.id };
                  myData.posts.forEach(post => post.user = JSON.parse(JSON.stringify(myUser)));
                  this.posts = this.posts.concat(myData.posts);
                  this.postsLoaded = true;
                  this.messageService.updateMessage('posts loaded');
                });
            }
          });
      });
  }

}
