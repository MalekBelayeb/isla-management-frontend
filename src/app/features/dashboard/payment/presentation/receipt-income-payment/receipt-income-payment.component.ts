import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PaymentReceiptDetails } from '@dashboard/payment/entity/income-receipt-details';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';

@Component({
  selector: 'app-receipt-income-payment',
  templateUrl: './receipt-income-payment.component.html',
  styleUrl: './receipt-income-payment.component.css',
})
export class ReceiptIncomePaymentComponent {
  constructor(private paymentService: PaymentService) {}

  @ViewChild('incomeVoucher') incomeVoucherPrintSection!: ElementRef;

  // Loads the receipt as soon as the component is created (or the id changes).
  // Angular skips this when the same id is set again, so after an update the
  // parent calls getPaymentDetails() directly via @ViewChild
  @Input() set paymentId(value: string | undefined) {
    this.getPaymentDetails(value);
  }

  todayDate = new Date();
  paymentReceiptDetails?: PaymentReceiptDetails;

  getPaymentDetails(paymentId?: string) {
    if (!paymentId) return;
    this.paymentService.getPayment(paymentId).subscribe({
      next: (value) => {
        const result = value.body;

        this.paymentReceiptDetails =
          PaymentMapper.mapPaymentReceipeDetails(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
}
