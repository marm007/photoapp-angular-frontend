import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';
import {MessageService} from '../../services/message/message.service';
import moment, {MomentCreationData} from 'moment';
import {hasOwnProperty} from 'tslint/lib/utils';

export interface Filter {
  id: string;
  title: string;
  created_after?: string;
  created_before?: string;
  isPost?: boolean;
}

export interface Sort {
  id: string;
  title: string;
  dir: number;
  isPost?: boolean;
}

export interface SortFilter {
  sort?: Sort;
  filter?: Filter;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  filters: Filter[] = [
    {id: 'last_hour', title: 'Last hour'},
    {id: 'today', title: 'Today'},
    {id: 'this_week', title: 'This week'},
    {id: 'this_month', title: 'This month'},
    {id: 'this_year', title: 'This year'},
  ];

  sortsPosts: Sort[] = [
    {id: 'created', title: 'Upload date', dir: 1},
    {id: 'likes', title: 'Likes', dir: 1},
  ];

  sortsRelations: Sort[] = [
    {id: 'created', title: 'Upload date', dir: 1},
  ];

  currentFilter: Filter = {id: 'none', title: '', isPost: true};
  currentSort: Sort = {dir: 0, id: 'none', title: '', isPost: true};

  sortUp = faSortUp;
  sortDown = faSortDown;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: SortFilter,
              private bottomSheetRef: MatBottomSheetRef<FilterComponent>,
              private messageService: MessageService,
              ) {
    console.log(data);
  }

  ngOnInit(): void {
    if (this.data.sort !== undefined) {
      console.log(this.data);
      this.currentFilter = this.data.filter;
      this.currentSort = this.data.sort;
    }
  }

  ngOnDestroy(): void {
    const sortFilter = {sort: this.currentSort, filter: this.currentFilter};
    this.bottomSheetRef.dismiss(sortFilter);
  }

  handleFilterClick(filter: Filter, isPost: boolean) {
    filter.isPost = isPost;
    if (this.currentFilter !== undefined && this.currentFilter.id === filter.id) {
      this.currentFilter = {id: 'none', title: '', isPost: this.currentFilter.isPost};
      this.messageService.updateMessage(`reset_filter_${isPost}`);
    } else {
      filter.created_before = moment().toISOString();
      switch (filter.id) {
        case 'last_hour':
          filter.created_after = moment().subtract(1, 'hour').toISOString();
          break;
        case 'today':
          filter.created_after = moment().startOf('day').toISOString();
          break;
        case 'this_week':
          filter.created_after = moment().startOf('week').toISOString();
          break;
        case 'this_month':
          filter.created_after = moment().startOf('month').toISOString();
          break;
        case 'this_year':
          filter.created_after = moment().startOf('year').toISOString();
          break;
      }
      filter.created_before = filter.created_before
        .replace('T', ' ').replace('Z', '');
      filter.created_after = filter.created_after
        .replace('T', ' ').replace('Z', '');
      this.messageService.updateSortFilterMessage(filter);
      console.log(this.currentFilter);
      this.currentFilter = filter;
    }
  }

  handleSortClick(sort: Sort, isPost: boolean) {
    sort.isPost = isPost;
    if (this.currentSort !== undefined && this.currentSort.id === sort.id) {
      this.currentSort.dir = this.currentSort.dir * -1;
    } else {
      this.currentSort = sort;
    }

    this.messageService.updateSortFilterMessage(this.currentSort);
  }

  onSelectedChanged() {
    this.currentFilter = {id: 'none', title: '', isPost: this.currentFilter.isPost};
    this.currentSort  = {dir: 0, id: 'none', title: '', isPost: this.currentSort.isPost};
    this.messageService.updateMessage(`reset_filter_${this.currentFilter.isPost}`);

  }

}
