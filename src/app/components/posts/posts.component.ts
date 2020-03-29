import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../../models/post';
import {PostsService} from '../../services/post/posts.service';
import {MessageService} from '../../services/message/message.service';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {Follower} from '../../models/follower';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

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
      console.log('CAN DELETE');
      this.posts.splice(index, 1);
    }
  }

  async getPost(id: number): Promise<Post> {
    return await new Promise<Post>(resolve =>
      this.postService.getPost(id)
        .subscribe(post => {
          resolve(post);
        }));
  }

  getPosts(): void {
    this.posts = [];
    const requests = [];
    if (this.usersFollowed !== undefined) {
      this.usersFollowed.forEach((followed) => {
        requests.push(
          this.userService.getUser(followed.user_being_followed).subscribe(user => {
            console.log('USER FOLLOWED')
            console.log(user)
            user.posts.forEach((postID) => {
              this.getPost(postID).then(post => {
                this.posts = this.posts.concat(post);
              });
            });
          }));
      });

      requests.push(
        this.userService.getUser(this.authService.userID)
          .subscribe(user => {
            user.posts.forEach((postID) => {
              this.getPost(postID).then(post => {
                this.posts = this.posts.concat(post);
              });
            });
          }));

      Promise.all(requests).then(() => {
        this.posts.sort(((a, b) => {
          if (a.created > b.created) {
            return -1;
          }
          if (a.created < b.created) {
            return 1;
          }
          return 0;
        }));
        this.postsLoaded = true;
        this.messageService.updateMessage('posts loaded');
      });
    }
  }

}
