import { Component, OnInit } from '@angular/core';
import {User} from '../models/user';
import {UserService} from '../services/user/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  searchResult: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }



}
