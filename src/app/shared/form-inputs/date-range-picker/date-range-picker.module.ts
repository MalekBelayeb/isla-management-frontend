import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  declarations: [DateRangePickerComponent],
  exports: [DateRangePickerComponent],
  imports: [CommonModule],
})
export class DateRangePickerModule {}
