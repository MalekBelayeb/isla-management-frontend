import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@models/user';

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  isCollapsed?: boolean;
}

export const DASHBOARD_ROUTES: RouteInfo[] = [
  {
    path: '/dashboard/owner',
    title: 'Propriétaires',
    type: 'sub',
    icontype: 'fa-user-tie text-primary',
    collapse: 'examples',
    isCollapsed: false,
    children: [
      { path: 'all-owners', title: 'Liste des propriètaires', type: 'link' },
    ],
  },
  {
    path: '/dashboard',
    title: 'Propriétés & Locaux',
    type: 'sub',
    icontype: 'fa-home text-primary',
    children: [
      {
        path: 'property',
        title: 'Liste des propriétés',
        type: 'link',
      },
      {
        path: 'apartment',
        title: 'Liste des locaux',
        type: 'link',
      },
    ],
  },
  {
    path: '/dashboard/tenant',
    title: 'Locataires',
    type: 'sub',
    icontype: 'fa-users text-primary',
    children: [
      { path: 'all-tenants', title: 'Liste des locataires', type: 'link' },
      { path: 'late-payers', title: 'Liste des impayés', type: 'link' },
    ],
  },
  {
    path: '/dashboard',
    title: 'Contrats & Opérations',
    type: 'sub',
    icontype: 'fa-file-signature text-primary',
    children: [
      {
        path: 'agreement/all-agreements',
        title: 'Contrats',
        type: 'link',
      },
      {
        path: 'payment/income-payments',
        title: 'Opérations de recettes',
        type: 'link',
      },
      {
        path: 'payment/expense-payments',
        title: 'Opérations de dépenses',
        type: 'link',
      },
    ],
  },
  {
    path: '/dashboard/finance',
    title: 'Comptabilité et Finance',
    type: 'sub',
    icontype: 'fa-solid fa-coins text-primary',
    children: [
      {
        path: 'agency',
        title: 'Agence',
        type: 'link',
      },
      {
        path: 'bank',
        title: 'Banque',
        type: 'link',
      },
      {
        path: 'balance-summary',
        title: 'Bilan total',
        type: 'link',
      },
    ],
  },
];

//habitation professionel commercial

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];
  public isCollapsed = true;

  // <768px: off-canvas full menu, 768–1199px: icon-only menu, ≥1200px: full menu
  isMobile = false;
  isMinimalist = false;

  constructor(private router: Router) {}

  @Input() user?: User;
  @Input() getUserIsLoading = false;
  @Input() mobileOpen = false;

  @Output() mobileClose = new EventEmitter<void>();

  ngOnInit() {
    this.updateLayout();
    this.menuItems = DASHBOARD_ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationEnd && this.mobileOpen) {
        this.mobileClose.emit();
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateLayout();
  }

  private updateLayout() {
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isMinimalist = width >= 768 && width < 1200;
    if (!this.isMobile && this.mobileOpen) {
      this.mobileClose.emit();
    }
  }

  navigateTo(parent: string, child: string) {
    this.router.navigate([`${parent}`, `${child}`]);
  }
}
