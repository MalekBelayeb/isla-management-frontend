import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    ],
  },
  {
    path: '/dashboard',
    title: 'Contrats & Mouvements',
    type: 'sub',
    icontype: 'fa-file-signature text-primary',
    children: [
      {
        path: 'agreement/all-agreements',
        title: 'Contrats',
        type: 'link',
      },
      {
        path: 'payment/all-payments',
        title: 'Mouvements de caisse',
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
        path: 'expenses',
        title: 'Dépenses',
        type: 'link',
      },
      {
        path: 'income',
        title: 'Recettes',
        type: 'link',
      },
      {
        path: 'balance-summary',
        title: 'Bilan',
        type: 'link',
      },
    ],
  },
  {
    path: '/dashboard/finance',
    title: 'Agence',
    type: 'sub',
    icontype: 'fa-solid fa-suitcase text-primary',
    children: [
      {
        path: 'expenses',
        title: 'Comptes',
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

  isMinimalist = false;

  constructor(private router: Router) {}

  @Input() user?: User;
  @Input() getUserIsLoading = false;

  ngOnInit() {
    this.isMinimalist = window.innerWidth < 1200;
    this.menuItems = DASHBOARD_ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMinimalist = window.innerWidth < 1200;
  }

  navigateTo(parent: string, child: string) {
    this.router.navigate([`${parent}`, `${child}`]);
  }
}
