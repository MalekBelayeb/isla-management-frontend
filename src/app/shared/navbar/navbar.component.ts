import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { SearchResult } from '../search-input/search-input.component';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastAlertService } from '../toast-alert/toast-alert.service';
import { DASHBOARD_ROUTES } from '@shared/sidebar/sidebar.component';
import { User } from '@models/user';

interface NotificationModel {
  id: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [ConfirmDialogService],
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles: any[] = [];
  public location: Location;
  codeSociety = '';
  searchModal?: BsModalRef;

  @ViewChild('modalSearch') modalSearch?: TemplateRef<void>;

  @Input() user?: User;
  @Input() getUserIsLoading = false;

  @Output() logoutClick = new EventEmitter<void>();

  placesAutocompleResult: SearchResult[] = [];
  sidenavOpen: boolean = true;
  notificationsNumber = 0;
  isLoading: boolean = false;
  notifications: NotificationModel[] = [];

  constructor(
    location: Location,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
  ) {
    this.location = location;
  }

  showModal() {
    this.searchModal = this.modalService.show(this.modalSearch!, {
      class: 'modal-xl',
    });
  }

  hideModal() {
    this.searchModal?.hide();
  }

  openSidebar() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.sidenavOpen = false;
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.sidenavOpen = true;
    }
  }

  moveToTenantDetail(id: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`./dashboard/tenant/tenant-details/${id}`]);
    });

    this.hideModal();
  }

  logout() {
    this.toastAlertService.toastr.clear();

    this.confirmDialogService.showDialog({
      title: 'Êtes-vous sûr de vouloir confirmer ?',
      message:
        'Êtes-vous sûr de vouloir vous déconnecter ? Cette action fermera votre session actuelle',
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onCancelClick: () => {},
      onConfirmClick: () => {
        this.logoutClick.emit();
      },
    });
  }

  ngOnInit() {
    this.listTitles = DASHBOARD_ROUTES.filter((listTitle) => listTitle);
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (const listTitle of this.listTitles) {
      if (listTitle.path === titlee) {
        return listTitle.title;
      }
    }
    return 'Dashboard';
  }

  openSearch() {
    document.body.classList.add('g-navbar-search-showing');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-showing');
      document.body.classList.add('g-navbar-search-show');
    }, 150);
    setTimeout(function () {
      document.body.classList.add('g-navbar-search-shown');
    }, 300);
  }

  closeSearch() {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(function () {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  }

  redirectToNotificationDetail(id: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`./dashboard/employee/employee-details/${id}`], {
        queryParams: { scrollTo: 'address' },
      });
    });
  }
}
