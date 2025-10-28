import { Component } from '@angular/core';
import { AggrementRoutingModule } from "@dashboard/agreement/agreement-routing.module";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [AggrementRoutingModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

}
