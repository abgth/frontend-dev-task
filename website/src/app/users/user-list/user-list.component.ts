import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UsersService } from './../services/users.service';
import {User} from './../models/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public dataSource: User[] = [];
  public page = 0;
  public size = 20;
  public total = 0;
  public totalPage = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public displayedColumns: string[] = ['firstName', 'lastName', 'birthDate', 'gender', 'id', 'delete'];
  public gender: object = {
    M: 'Male',
    F: 'Female'
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
  ) { }

  initializeUserData(page: number = this.page, size: number = this.size) {
    this.userService.getUserList(page, size)
      .subscribe((data: { items: User[], page: number, total: number, size: number}) => {
        this.dataSource = data.items;
        this.total = data.total;
        this.totalPage = Math.round(this.total / this.size) - 1;
      });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log('setPageSizeOptionsInput')
    console.log(setPageSizeOptionsInput)
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const page = parseInt(params.get('page'), 10) || 0;
      this.page = page;
      this.initializeUserData(page);
    });
  }

  fetchData(pageOption) {
    this.initializeUserData(pageOption.pageIndex, pageOption.pageSize);
  }

  deleteUser(userId) {
    this.userService.deleteUserById(userId)
      .subscribe(
        success => {
          this.initializeUserData();
        },
        error => console.log(error)
      );
    // /users/[userId] api is not working as expected, the request is not completing successfully.
    setTimeout(() => {
      this.initializeUserData();
    }, 200);
  }
}
