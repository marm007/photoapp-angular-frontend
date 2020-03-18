import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as data from '../relations_data.json';
@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationsComponent implements OnInit {

  // @ts-ignore
  relations = data.default;

  constructor() {
    console.log(this.relations);
  }

  ngOnInit(): void {
  }

}
