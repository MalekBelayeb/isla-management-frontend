import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';
import { AgreementsListComponent } from './presentation/agreements-list/agreements-list.component';
import { UpsertAgreementComponent } from './presentation/upsert-agreement/upsert-agreement.component';
import { AgreementDetailsComponent } from './presentation/agreement-details/Agreement-details.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-agreements',
        pathMatch: 'full',
      },
      {
        path: 'all-agreements',
        component: AgreementsListComponent,
      },
      {
        path: 'create-agreement',
        component: UpsertAgreementComponent,
      },
      {
        path: 'agreement-details/:id',
        component: AgreementDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggrementRoutingModule {}
