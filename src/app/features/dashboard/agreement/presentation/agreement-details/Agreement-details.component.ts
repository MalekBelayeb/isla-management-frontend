import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { DataTypes } from '@models/data';
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
  isSuspendAgreementLoading: boolean = false;

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

  toogleAgreementStatus(id: string) {
    const status =
      this.agreementDetails?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    if (this.agreementDetails?.status === 'ACTIVE') {
      this.editAgreementWithConfirmDialog(id, status);
    } else {
      this.editAgreementStatus(id, status);
    }
  }
  editAgreementStatus(id: string, status: string) {
    let body: any = {
      ...(this.agreementDetails && { id: this.agreementDetails.id }),

      rentAmount: this.agreementDetails?.rentAmount,
      startDate: this.agreementDetails?.startDate,
      paymentFrequency: DataTypes.paymentFrequencyTypeList.find(
        (item) => item?.title === this.agreementDetails?.paymentFrequency,
      )?.id,
      apartmentId: this.agreementDetails?.apartmentId,
      tenantId: this.agreementDetails?.tenantId,
      ...(this.agreementDetails?.nbDaysOfTolerance && {
        nbDaysOfTolerance: Number(this.agreementDetails?.nbDaysOfTolerance),
      }),
      ...(this.agreementDetails?.deposit && {
        deposit: this.agreementDetails?.deposit,
      }),
      ...(this.agreementDetails?.firstDayOfPayment && {
        firstDayOfPayment: new Date(this.agreementDetails?.firstDayOfPayment),
      }),
      ...(this.agreementDetails?.notes && {
        notes: this.agreementDetails?.notes,
      }),
      status,
    };

    this.isSuspendAgreementLoading = true;
    this.agreementService.updateAgreement(id, body).subscribe({
      next: () => {
        this.isSuspendAgreementLoading = false;
        if (this.agreementDetails?.status === 'ACTIVE') {
          this.toastAlertService.showSuccessNotification(
            'Contrat suspendu avec succés',
            'Contrat a été suspendu avec succés',
          );
        } else {
          this.toastAlertService.showSuccessNotification(
            'Contrat activé avec succés',
            'Contrat a été activé avec succés',
          );
        }
      },
      error: () => {
        this.isSuspendAgreementLoading = false;
      },
    });
  }

  editAgreementWithConfirmDialog(id: string, status: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir suspendre ce contrat ?`,
      message: ``,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.editAgreementStatus(id, 'SUSPENDED');
      },
    });
  }
}
