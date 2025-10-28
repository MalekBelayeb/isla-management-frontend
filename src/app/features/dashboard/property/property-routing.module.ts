import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyComponent } from './property.component';
import { PropertiesListComponent } from './presentation/properties-list/properties-list.component';
import { UpsertPropertyComponent } from './presentation/upsert-property/upsert-property.component';
import { PropertyDetailsComponent } from './presentation/property-details/property-details.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-properties',
        pathMatch: 'full',
      },
      {
        path: 'all-properties',
        component: PropertiesListComponent,
      },

      {
        path: 'create-property',
        component: UpsertPropertyComponent,
      },
      {
        path: 'property-details/:id',
        component: PropertyDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyRoutingModule {}
