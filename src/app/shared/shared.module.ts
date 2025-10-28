import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SearchInputModule } from './search-input/search-input.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmDialogService } from './confirm-dialog/confirm-dialog.service';
import { SearchableModalModule } from './searchable-modal/searchable-modal.module';
import { DateShiftPipe } from '@core/pipes/date-shift.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DateShiftPipe,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConfirmDialogComponent,
  ],
  exports: [FooterComponent, NavbarComponent, SidebarComponent, DateShiftPipe],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forChild(),
    SearchableModalModule,
  ],
  providers: [ConfirmDialogService],
})
export class SharedModule {}
