import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PropertiesListComponent } from './presentation/properties-list/properties-list.component';
import { UpsertPropertyComponent } from './presentation/upsert-property/upsert-property.component';
import { PropertyDetailsComponent } from './presentation/property-details/property-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SearchInputModule } from '@shared/search-input/search-input.module';

@NgModule({
  declarations: [
    PropertyComponent,
    PropertiesListComponent,
    UpsertPropertyComponent,
    PropertyDetailsComponent,
  ],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SearchInputModule,
  ],
})
export class PropertyModule {}
