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

  constructor() {
    console.log(this.profile)
  }

  ngOnInit(): void {
  }

}
