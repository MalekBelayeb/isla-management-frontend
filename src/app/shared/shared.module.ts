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
import { DateShiftPipe } from '@core/pipes/date-shift.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TenantSearchableModalComponent } from './searchable-modals/components/tenant-searchable-modal/tenant-searchable-modal.component';
import { AgreementSearchableModalComponent } from './searchable-modals/components/agreement-searchable-modal/agreement-searchable-modal.component';

@NgModule({
  declarations: [
    DateShiftPipe,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConfirmDialogComponent,
    TenantSearchableModalComponent,
    AgreementSearchableModalComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    DateShiftPipe,
    TenantSearchableModalComponent,
    AgreementSearchableModalComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forChild(),
  ],
  providers: [ConfirmDialogService],
})
export class SharedModule {}
