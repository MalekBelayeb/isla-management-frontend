import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable()
export class ConfirmDialogService {


  constructor(private modalService: BsModalService, private modalRef: BsModalRef) { }

  showDialog(modalContent: { title: string, message: string, cancelBtnTitle: string, confirmBtnTitle: string, onCancelClick?: VoidFunction, onConfirmClick: VoidFunction }) {

    const initialState = { message: modalContent.message, title: modalContent.title };
    const modalConfig = { animated: true, keyboard: true, backdrop: true, ignoreBackdropClick: false };
    this.modalRef = this.modalService.show(ConfirmDialogComponent,
      Object.assign({}, modalConfig, {
        class: 'modal-md', initialState
      }))

    this.modalRef.content?.action.subscribe((value: any) => {
      this.modalRef.hide()
      this.modalRef.onHide?.subscribe({
        next: () => {

          if (value) {

            modalContent.onConfirmClick()

          } else {
            if (!modalContent.onCancelClick) return
            modalContent.onCancelClick()
          }

        }
      })
    })
  }
}
