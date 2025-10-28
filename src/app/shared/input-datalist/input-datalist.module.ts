import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDatalistComponent } from './input-datalist.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [InputDatalistComponent],
  imports: [CommonModule, BsDropdownModule.forRoot()],
})
export class InputDatalistModule {}
