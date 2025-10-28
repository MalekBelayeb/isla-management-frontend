import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnersListComponent } from './presentation/owners-list/owners-list.component';
import { OwnerComponent } from './owner.component';
import { UpsertOwnerComponent } from './presentation/upsert-owner/upsert-owner.component';
import { OwnerDetailsComponent } from './presentation/owner-details/owner-details.component';

const routes: Routes = [
  {
    path: '',
    component: OwnerComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-owners',
        pathMatch: 'full',
      },
      {
        path: 'all-owners',
        component: OwnersListComponent,
      },
      {
        path: 'create-owner',
        component: UpsertOwnerComponent,
      },
      {
        path: 'owner-details/:id',
        component: OwnerDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRoutingModule {}
