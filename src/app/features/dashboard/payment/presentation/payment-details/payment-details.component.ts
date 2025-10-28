import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css',
})
export class PaymentDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
  ) {}

  paymentDetails?: PaymentDetails;

  ngOnInit() {
    this.getPaymentDetails();
  }

  getPaymentId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  getPaymentDetails() {
    console.log(this.getPaymentId());

    this.paymentService.getPayment(this.getPaymentId()).subscribe({
      next: (value) => {
        const result = value.body;
        this.paymentDetails = PaymentMapper.mapPaymentDetails(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
