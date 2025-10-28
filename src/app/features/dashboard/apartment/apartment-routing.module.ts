import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartmentComponent } from './apartment.component';
import { ApartmentListComponent } from './presentation/apartment-list/apartment-list.component';
import { UpsertApartmentComponent } from './presentation/upsert-apartment/upsert-apartment.component';
import { ApartmentDetailsComponent } from './presentation/apartment-details/apartment-details.component';

const routes: Routes = [
  {
    path: '',
    component: ApartmentComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-apartments',
        pathMatch: 'full',
      },
      {
        path: 'all-apartments',
        component: ApartmentListComponent,
      },

      {
        path: 'create-apartment',
        component: UpsertApartmentComponent,
      },
      {
        path: 'apartment-details/:id',
        component: ApartmentDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApartmentRoutingModule {}
