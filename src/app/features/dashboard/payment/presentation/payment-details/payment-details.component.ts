import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css',
})
export class PaymentDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
  ) {}

  paymentDetails?: PaymentDetails;
  propertyPrefix: string = propertyPrefix;

  exportReceiptIsLoading: boolean = false;
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
  generateReceipt(paymentId: string) {
    this.paymentService.generateReceipt(paymentId).subscribe({
      next: (value) => {
        const time = new Date().getTime();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(value);
        link.download = `quittance_de_paiement_${time}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.exportReceiptIsLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.exportReceiptIsLoading = false;
      },
    });
  }
  exportPaymentReceipt() {
    this.exportReceiptIsLoading = true;
    if (!this.paymentDetails?.id) return;
    this.generateReceipt(this.paymentDetails?.id);
  }
}
