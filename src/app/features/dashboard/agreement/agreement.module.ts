import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AggrementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';
import { AgreementsListComponent } from './presentation/agreements-list/agreements-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchAutocompleteInputModule } from '@shared/searchable-autocomplete-inputs/search-autocomple-input-module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UpsertAgreementComponent } from './presentation/upsert-agreement/upsert-agreement.component';
import { AgreementDetailsComponent } from './presentation/agreement-details/Agreement-details.component';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';

@NgModule({
  declarations: [
    AgreementComponent,
    UpsertAgreementComponent,
    AgreementDetailsComponent,
    AgreementsListComponent,
  ],
  imports: [
    CommonModule,
    AggrementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SearchAutocompleteInputModule,
    DateRangePickerModule,
    PaginationModule.forRoot(),
  ],
})
export class AggrementModule {}
