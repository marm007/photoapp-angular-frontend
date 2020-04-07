import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';
import {MessageService} from '../../services/message/message.service';
import moment, {MomentCreationData} from 'moment';
import {hasOwnProperty} from 'tslint/lib/utils';

export interface Sort {
  id: string;
  title: string;
  dir: number;
}

export interface LikesSort {
  likes__gt?: number;
  likes__lt?: number;
  likesGtClicked: boolean;
  likesLtClicked: boolean;
}

export interface Filter {
  id: string;
  title: string;
  created_after?: string;
  created_before?: string;
}

export interface SortFilterMessage {
  sort?: Sort;
  filter?: Filter;
  likesSort?: LikesSort;
  isPost: boolean;
}

export interface SortFilter {
  sort_post?: Sort;
  filter_post?: Filter;

  sort_relation?: Sort;
  filter_relation?: Filter;

  sort_likes?: LikesSort;
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

  currentFilterPost: Filter = {id: 'none', title: ''};
  currentSortPost: Sort = {dir: 0, id: 'none', title: ''};

  currentFilterRelation: Filter = {id: 'none', title: ''};
  currentSortRelation: Sort = {dir: 0, id: 'none', title: ''};

  likesSort: LikesSort = {likesGtClicked: false, likesLtClicked: false, likes__gt: null, likes__lt: null};
  sortUp = faSortUp;
  sortDown = faSortDown;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: SortFilter,
              private bottomSheetRef: MatBottomSheetRef<FilterComponent>,
              private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.sort_post !== undefined) {
      this.currentSortPost = this.data.sort_post;
    }
    if (this.data.filter_post !== undefined) {
      this.currentFilterPost = this.data.filter_post;
    }
    if (this.data.sort_relation !== undefined) {
      this.currentSortRelation = this.data.sort_relation;
    }
    if (this.data.filter_relation !== undefined) {
      this.currentFilterRelation = this.data.filter_relation;
    }
    if (this.data.sort_likes !== undefined) {
      this.likesSort = this.data.sort_likes;
    }

  }

  ngOnDestroy(): void {
    const sortFilter: SortFilter = {
      sort_relation: this.currentSortRelation,
      sort_post: this.currentSortPost,
      filter_relation: this.currentFilterRelation,
      filter_post: this.currentFilterPost,
      sort_likes: this.likesSort
    };
    this.bottomSheetRef.dismiss(sortFilter);
  }

  handleFilterClick(filter: Filter, isPost: boolean) {

    if (isPost) {

      if (this.currentFilterPost !== undefined && this.currentFilterPost.id === filter.id) {
        this.currentFilterPost = {id: 'none', title: ''};
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
        const message: SortFilterMessage = {filter, isPost};
        this.messageService.updateSortFilterMessage(message);
        this.currentFilterPost = filter;
      }
    } else {
      if (this.currentFilterRelation !== undefined && this.currentFilterRelation.id === filter.id) {
        this.currentFilterRelation = {id: 'none', title: ''};
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
        const message: SortFilterMessage = {filter, isPost};
        this.messageService.updateSortFilterMessage(message);
        this.currentFilterRelation = filter;
      }
    }

  }

  handleSortClick(sort: Sort, isPost: boolean) {
    console.log(sort);
    console.log(this.currentSortPost);
    if (isPost) {

      if (this.currentSortPost !== undefined && this.currentSortPost.id === sort.id) {
        this.currentSortPost.dir = this.currentSortPost.dir * -1;
      } else {
        this.currentSortPost = sort;
      }
      const message: SortFilterMessage = {sort:  this.currentSortPost, isPost};
      this.messageService.updateSortFilterMessage(message);
    } else {

      if (this.currentSortRelation !== undefined && this.currentSortRelation.id === sort.id) {
        this.currentSortRelation.dir = this.currentSortRelation.dir * -1;
      } else {
        this.currentSortRelation = sort;
      }

      const message: SortFilterMessage = {sort:  this.currentSortRelation, isPost};
      this.messageService.updateSortFilterMessage(message);
    }

  }

  formatLabelGreaterThan(value: number) {

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  formatLabelLowerThan(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  handleLikesLowerThanClick() {
    this.likesSort.likesLtClicked = !this.likesSort.likesLtClicked;
    if (this.likesSort.likesLtClicked) {
      const message: SortFilterMessage = {likesSort: this.likesSort, isPost: true};
      this.messageService.updateSortFilterMessage(message);
    } else {
      delete this.likesSort.likes__lt;
      delete this.likesSort.likesLtClicked;
      const message: SortFilterMessage = {likesSort: this.likesSort, isPost: true};
      this.messageService.updateSortFilterMessage(message);
    }
  }

  handleLikesGreaterThanClick() {
    this.likesSort.likesGtClicked = !this.likesSort.likesGtClicked;
    if (this.likesSort.likesGtClicked) {
      const message: SortFilterMessage = {likesSort: this.likesSort, isPost: true};
      this.messageService.updateSortFilterMessage(message);
    } else {
      delete this.likesSort.likes__gt;
      delete this.likesSort.likesGtClicked;
      const message: SortFilterMessage = {likesSort: this.likesSort, isPost: true};
      this.messageService.updateSortFilterMessage(message);
    }
  }

  handleLikesLowerThanChange(value: number) {
    this.likesSort.likes__lt = value;
    if (this.likesSort.likesLtClicked) {
      const message: SortFilterMessage = {likesSort: this.likesSort, isPost: true};
      this.messageService.updateSortFilterMessage(message);
    }
  }

  handleLikesGreaterThanChange(value: number) {
    this.likesSort.likes__gt = value;
    if (this.likesSort.likesGtClicked) {
      const message: SortFilterMessage = {likesSort: this.likesSort, isPost: true};
      this.messageService.updateSortFilterMessage(message);
    }
  }
}
