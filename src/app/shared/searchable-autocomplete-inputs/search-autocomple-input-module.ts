import { NgModule } from '@angular/core';
import { SearchSiteInputComponent } from './search-site-input/search-site-input.component';
import { SearchActivityInputComponent } from './search-activity-input/search-activity-input.component';
import { SearchShiftInputComponent } from './search-shift-input/search-shift-input.component';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { SearchPackageInputComponent } from './search-package-input/search-package-input.component';
import { SearchEmployeeInputComponent } from './search-employee-input/search-employee-input.component';
import { SearchInputComponent } from '@shared/search-input/search-input.component';

@NgModule({
  declarations: [
    SearchSiteInputComponent,
    SearchActivityInputComponent,
    SearchShiftInputComponent,
    SearchPackageInputComponent,
    SearchEmployeeInputComponent,
  ],
  exports: [
    SearchSiteInputComponent,
    SearchActivityInputComponent,
    SearchShiftInputComponent,
    SearchPackageInputComponent,
    SearchEmployeeInputComponent,
    SearchInputComponent,
  ],
  imports: [SearchInputModule],
})
export class SearchAutocompleteInputModule {}
