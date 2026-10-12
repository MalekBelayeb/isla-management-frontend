import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentReceiptDetails } from '@dashboard/payment/entity/income-receipt-details';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-bank-payment-details',
  templateUrl: './bank-payment-details.component.html',
  styleUrl: './bank-payment-details.component.css',
})
export class BankPaymentDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
  ) {}

  paymentDetails?: PaymentDetails;
  paymentReceiptDetails?: PaymentReceiptDetails;

  propertyPrefix: string = propertyPrefix;
  exportReceiptIsLoading: boolean = false;

  @ViewChild('expenseVoucher') expenseVoucherPrintSection!: ElementRef;
  @ViewChild('incomeVoucher') incomeVoucherPrintSection!: ElementRef;

  todayDate = new Date();

  ngOnInit() {
    this.getPaymentDetails();
  }

  getPaymentId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  getPaymentDetails() {
    this.paymentService.getPayment(this.getPaymentId()).subscribe({
      next: (value) => {
        const result = value.body;
        this.paymentDetails = PaymentMapper.mapPaymentDetails(result);

        this.paymentReceiptDetails =
          PaymentMapper.mapPaymentReceipeDetails(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
