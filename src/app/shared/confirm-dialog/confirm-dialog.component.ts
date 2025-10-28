import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {


  @Input() message = '';
  @Input() title = '';
  @Input() confirmBtnTitle = 'Confirmer';
  @Input() cancelBtnTitle = 'Annuler';

  @Output() action = new EventEmitter<boolean>();

  cancelModal() {

    this.action.emit(false);

  }

  confirmModal() {

    this.action.emit(true);

  }

}
