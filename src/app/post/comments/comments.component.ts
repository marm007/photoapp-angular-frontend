import { Component, Input, OnInit } from '@angular/core';
import { faPlusCircle, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Comment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment/comment.service';
import { PostsService } from 'src/app/services/post/posts.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() initialComments: [Comment];

  @Input() userId: string;

  @Input() postId: string;

  @Input() isDesktop: boolean;

  comments = [];

  isMoreComments = false;

  circleIcon = faPlusCircle;
  moreIcon = faEllipsisH;

  constructor(private postService: PostsService, private commentService: CommentService) { }

  get offset(): string {
    let offset = 0;

    if (this.comments) offset += this.comments.length;
    if (this.initialComments) offset += this.initialComments.length;

    return offset.toString()
  }

  ngOnInit(): void {
    this.isMoreComments = this.initialComments && this.initialComments.length === Number(2)
  }


  loadMoreComments() {
    this.postService.getComments(this.postId, this.offset)
      .subscribe(
        res => {
          this.isMoreComments = res.length === Number(10)
          this.comments = [...this.comments, ...res]
        },
        err => {
          console.error('load more comments', err)
        }
      )
  }


  handleCommentDelete(id: string) {
    this.commentService.delete(id)
      .subscribe(res => {
        //const comment = this.post.comments.find(c => c.id === id);
        //const index = this.post.comments.indexOf(comment);
        //this.post.comments.splice(index, 1);
      }, error => {

      });
  }
}
