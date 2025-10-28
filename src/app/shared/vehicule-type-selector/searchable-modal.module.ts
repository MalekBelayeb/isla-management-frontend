import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculeTypeSelectorComponent } from './vehicule-type-selector.component';

@NgModule({
  declarations: [
    VehiculeTypeSelectorComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    VehiculeTypeSelectorComponent
  ]
})
export class VehiculeTypeSelectorModule { }
