import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth/service/user.service';
import { User } from '@models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isSidebarOpen = false;

  constructor(private userService: UserService) {}

  user?: User;
  fetchUserIsLoading = false;

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logoutUser() {
    this.userService.logoutUser().subscribe({
      next: (value) => {
        location.reload();
      },
      error: (err) => {
        location.reload();
      },
    });
  }
}
