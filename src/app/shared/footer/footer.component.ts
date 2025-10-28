import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  supportContactModal?: BsModalRef;
  @ViewChild('modalSupportContact') modalSupportContact?: TemplateRef<void>;

  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  showModal() {
    this.supportContactModal = this.modalService.show(
      this.modalSupportContact!,
      {
        class: 'modal-md',
      },
    );
  }

  hideCodeSocietyModal() {
    this.supportContactModal?.hide();
  }
}
