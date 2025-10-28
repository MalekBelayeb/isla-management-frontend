import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [SearchInputComponent],
  imports: [CommonModule, BsDropdownModule.forRoot()],
  exports: [SearchInputComponent],
})
export class SearchInputModule {}
