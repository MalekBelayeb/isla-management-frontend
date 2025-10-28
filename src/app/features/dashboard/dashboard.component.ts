import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../auth/service/user.service';
import { User } from '@models/old/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isMobileResolution: boolean;

  constructor(private userService: UserService) {
    this.isMobileResolution = false;
    /*if (window.innerWidth < 1200) {
    } else {
      this.isMobileResolution = false;
    }*/
  }

  @HostListener('window:resize', ['$event'])
  isMobile(event: any) {
    this.isMobileResolution = false;
  }

  user?: User;
  fetchUserIsLoading = false;

  ngOnInit(): void {
    //this.user = this.userService.getUser()
    this.user = {
      email: '',
      firstname: '',
      lastname: '',
      societyId: '',
      societyLogo: 'isla-immobiliere-logo.png',
      societyName: 'ISLA Immobilière',
      type: 'admin',
      webSite: '',
    };
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
