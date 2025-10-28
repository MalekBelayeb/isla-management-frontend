import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSliderComponent } from './input-slider.component';

@NgModule({
  declarations: [InputSliderComponent],
  exports: [InputSliderComponent],
  imports: [CommonModule],
})
export class InputSliderModule {}
