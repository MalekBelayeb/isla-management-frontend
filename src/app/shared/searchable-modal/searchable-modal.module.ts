import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableModalComponent } from './searchable-modal.component';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  declarations: [
    SearchableModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDatepickerModule.forRoot(),
  ],
  exports:[
    SearchableModalComponent
  ]
})
export class SearchableModalModule { }
