import { Component, OnInit } from '@angular/core';
import * as data from '../profile_data.json';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // @ts-ignore
  profile = data.default[0];

  loopIteration: number;

  profileUrls: Array<Array<number>>;

  constructor() {
    console.log(this.profile.posts.length);
    this.loopIteration = this.profile.posts.length / 3;
  }

  ngOnInit(): void {
  }

}
