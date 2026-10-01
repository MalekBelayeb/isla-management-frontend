import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentReceiptDetails } from '@dashboard/payment/entity/income-receipt-details';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { propertyPrefix } from 'src/app/variables/consts';
// @ts-ignore
import writtenNumber from 'written-number';

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
  writtenTotalAmount: string = '';
  exportReceiptIsLoading: boolean = false;

  @ViewChild('expenseVoucher') expenseVoucherPrintSection!: ElementRef;
  @ViewChild('incomeVoucher') incomeVoucherPrintSection!: ElementRef;

  paymentReceiptDetails?: PaymentReceiptDetails;
  todayDate = new Date();

  ngOnInit() {
    this.getPaymentDetails();
    console.log(this.convertNumbersToWrittenForm(500));
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

        this.writtenTotalAmount = this.convertNumbersToWrittenForm(
          this.paymentReceiptDetails.totalAmount ?? 0,
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  exportExpenseVoucherToPdf() {
    const content = this.expenseVoucherPrintSection.nativeElement.outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <style>
        /* ========================================== PAGE WRAPPER ========================================== */

        .expense-voucher-wrapper {
          display: flex;
          justify-content: center;
          padding: 40px;
          background: #f5f6fa;
        }

        /* ========================================== DOCUMENT ========================================== */

        .expense-voucher {
          width: 850px;
          min-height: 1100px;
          background: #ffffff;
          padding: 50px 70px;
          box-sizing: border-box;
          font-family: "Times New Roman", serif;
          color: #000;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
        }

        /* ========================================== HEADER ========================================== */

        .expense-voucher .voucher-header {
          display: grid;
          grid-template-columns: 220px 1fr 220px;
          align-items: start;
          gap: 25px;
        }

        .expense-voucher .voucher-company {
          text-align: center;
        }

        .expense-voucher .voucher-logo img {
          width: 170px;
          max-width: 100%;
          height: auto;
        }

        .expense-voucher .voucher-company-address {
          margin-top: 12px;
          font-size: 16px;
          line-height: 1.7;
        }

        .expense-voucher .voucher-title-box {
          height: 60px;
          border: 4px solid #444;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .expense-voucher .voucher-amount-box {
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 3px solid #444;
          padding-bottom: 8px;
          margin-top: 15px;
          font-size: 20px;
          font-weight: bold;
        }

        /* ========================================== META ========================================== */

        .expense-voucher .voucher-meta {
          width: 180px;
          margin-left: auto;
          margin-top: 80px;
        }

        .expense-voucher .voucher-meta-row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 18px;
        }

        .expense-voucher .voucher-meta-row strong {
          font-weight: bold;
        }

        /* ========================================== CONTENT ========================================== */

        .expense-voucher .voucher-content {
          margin-top: 80px;
        }

        .expense-voucher .voucher-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 40px;
          font-size: 18px;
        }

        .expense-voucher .voucher-label {
          width: 180px;
          flex-shrink: 0;
          font-weight: bold;
          white-space: nowrap;
        }

        .expense-voucher .voucher-separator {
          width: 30px;
          text-align: center;
          font-weight: bold;
        }

        .expense-voucher .voucher-value {
          flex: 1;
          line-height: 1.6;
        }

        /* ========================================== FOOTER ========================================== */

        .expense-voucher .voucher-footer {
          margin-top: 180px;
          display: flex;
          justify-content: flex-end;
        }

        .expense-voucher .voucher-signature-section {
          width: 280px;
          text-align: center;
        }

        .expense-voucher .voucher-date {
          font-size: 18px;
          margin-bottom: 35px;
        }

        .expense-voucher .voucher-signature-title {
          font-size: 18px;
          font-weight: bold;
        }

        /* ========================================== BOTTOM LINE ========================================== */

        .expense-voucher .voucher-bottom-line {
          width: 350px;
          border-bottom: 2px solid #555;
          margin-top: 120px;
        }

        /* ========================================== PRINT ========================================== */

        @media print {
          .expense-voucher-wrapper {
            padding: 0;
            background: white;
          }

          .expense-voucher {
            width: 100%;
            min-height: auto;
            box-shadow: none;
            margin: 0;
            padding: 40px;
          }
        }
      </style>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  exportIncomeVoucherToPdf() {
    const content = this.incomeVoucherPrintSection.nativeElement.outerHTML;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <style>
        .rent-receipt {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #f5f5f5;
          padding: 20px;
          box-sizing: border-box;
        }

        .rent-receipt .receipt-container {
          width: 800px;
          background: #ffffff;
          padding: 30px 50px;
          color: #222;
          font-family: "Times New Roman", serif;
          box-sizing: border-box;
        }

        .rent-receipt .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .rent-receipt .agency-info {
          width: 180px;
          text-align: center;
        }

        .rent-receipt .agency-logo img {
          width: 140px;
          max-width: 100%;
        }

        .rent-receipt .agency-details {
          font-size: 14px;
          margin-top: 8px;
          line-height: 1.4;
        }

        .rent-receipt .receipt-title-section {
          flex: 1;
          display: flex;
          justify-content: center;
          margin-top: 60px;
        }

        .rent-receipt .receipt-title {
          border: 5px solid #444;
          padding: 6px 35px;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .rent-receipt .receipt-reference {
          width: 150px;
          text-align: right;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.5;
        }

        .rent-receipt .period-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .rent-receipt .period-box {
          text-align: center;
          font-size: 16px;
          line-height: 1.5;
        }

        .rent-receipt .period-title {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .rent-receipt .tenant-section {
          margin-top: 40px;
        }

        .rent-receipt .info-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          font-size: 18px;
        }

        .rent-receipt .label {
          font-weight: 700;
          min-width: 120px;
        }

        .rent-receipt .amounts-section {
          margin-top: 25px;
        }

        .rent-receipt .receipt-table {
          width: 100%;
          border-collapse: collapse;
        }

        .rent-receipt .receipt-table th,
        .rent-receipt .receipt-table td {
          border: 1px solid #666;
          text-align: center;
          padding: 8px;
        }

        .rent-receipt .receipt-table th {
          font-size: 18px;
          font-weight: 700;
        }

        .rent-receipt .receipt-table td {
          font-size: 18px;
        }

        .rent-receipt .total-cell {
          font-weight: 700;
          border: 2px solid #444 !important;
        }

        .rent-receipt .summary-section {
          margin-top: 25px;
        }

        .rent-receipt .footer-section {
          margin-top: 35px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .rent-receipt .observations {
          width: 60%;
        }

        .rent-receipt .observation-text {
          margin-top: 8px;
          font-size: 13px;
          line-height: 1.5;
          text-decoration: underline;
        }

        .rent-receipt .signature-section {
          width: 35%;
          text-align: center;
          font-size: 18px;
          line-height: 1.7;
        }
      </style>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  private convertNumbersToWrittenForm(amount: number): string {
    const dinarsValue = Math.floor(amount);
    const millimesValue = Math.round((amount - dinarsValue) * 1000);

    const dinarsWrittenForm = writtenNumber(dinarsValue, {
      lang: 'fr',
    }).toUpperCase();
    const millimesWrittenForm = writtenNumber(millimesValue, {
      lang: 'fr',
    }).toUpperCase();

    if (millimesValue <= 0) {
      return `${dinarsWrittenForm} DINARS`;
    }

    return `${dinarsWrittenForm} DINARS ET ${millimesWrittenForm} MILLIMES`;
  }
}
