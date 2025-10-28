import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditLeaveModalContentComponent } from './edit-leave-modal-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    EditLeaveModalContentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [
    EditLeaveModalContentComponent
  ]
})
export class EditLeaveModalContentModule { }
