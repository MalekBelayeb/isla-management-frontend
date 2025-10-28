import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { SearchableMapsComponent } from './searchable-maps.component';
import { SearchInputModule } from '../search-input/search-input.module';



@NgModule({
  declarations: [
    SearchableMapsComponent
  ],
  imports: [
    CommonModule,
    SearchInputModule,
    GoogleMapsModule,
  ],
  exports:[
    SearchableMapsComponent
  ]
})
export class SearchableMapsModule { }
