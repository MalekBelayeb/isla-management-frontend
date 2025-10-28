import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusMapsComponent } from './bus-maps.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    BusMapsComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  exports: [
    BusMapsComponent
  ]
})
export class BusMapsModule { }
