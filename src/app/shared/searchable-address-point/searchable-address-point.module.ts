import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { SearchableAddressPointComponent } from './searchable-address-point.component';
import { SearchInputModule } from '../search-input/search-input.module';



@NgModule({
  declarations: [
    SearchableAddressPointComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule,
    GoogleMapsModule,
  ],
  exports: [
    SearchableAddressPointComponent
  ]
})
export class SearchableAddressPointModule { }
