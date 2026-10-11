import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PaymentReceiptDetails } from '@dashboard/payment/entity/income-receipt-details';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';

@Component({
  selector: 'app-receipt-expense-payment',
  templateUrl: './receipt-expense-payment.component.html',
  styleUrl: './receipt-expense-payment.component.css',
})
export class ReceiptExpensePaymentComponent {
  constructor(private paymentService: PaymentService) {}

  @ViewChild('expenseVoucher') expenseVoucherPrintSection!: ElementRef;

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
}
