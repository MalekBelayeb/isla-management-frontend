import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrl: './agreement-details.component.css',
})
export class AgreementDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private agreementService: AgreementService,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
  ) {}

  agreementDetails?: AgreementDetails;

  ngOnInit() {
    this.getAgreementDetails();
  }

  getAgreementId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  getAgreementDetails() {
    console.log(this.getAgreementId());

    this.agreementService.getAgreement(this.getAgreementId()).subscribe({
      next: (value) => {
        const result = value.body;
        //this.apartmentDetails = ApartmentMapper.mapApartmentDetails(result);
        this.agreementDetails = AgreeementMapper.mapAgreementDetails(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
