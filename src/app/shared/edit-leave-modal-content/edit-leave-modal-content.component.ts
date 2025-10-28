import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/features/dashboard/old/employee/service/employee.service';

@Component({
  selector: 'app-edit-leave-modal-content',
  templateUrl: './edit-leave-modal-content.component.html',
  styleUrls: ['./edit-leave-modal-content.component.css']
})
export class EditLeaveModalContentComponent implements OnChanges {


  updateLeaveIsSubmitted = false
  absenceFormGroup: FormGroup
  isLeaveLoading = false

  @Output() onError = new EventEmitter<void>()
  @Output() onSuccess = new EventEmitter<void>()
  @Output() onCancel = new EventEmitter<void>()
  @Input() idUser?: string = ''
  @Input() idLeave?: string = ''
  bsValue = new Date();
  @Input() bsRangeValue: Date[];

  maxDate = new Date();
  minDate = new Date();

  bsConfig = {
    isAnimated: true,
    containerClass: 'theme-red',

  }

  constructor(private employeeService: EmployeeService, private formBuild: FormBuilder) {
    this.absenceFormGroup = formBuild.group({ absenceRangeDate: new FormControl('', [Validators.required]) })
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes["bsRangeValue"]) {
      this.absenceFormGroup.get('absenceRangeDate')?.setValue(changes["bsRangeValue"].currentValue)
    }

    if (changes["idUser"]) {
      this.idUser = changes["idUser"].currentValue
    }

    if (changes["idLeave"]) {
      this.idLeave = changes["idLeave"].currentValue
    }

  }

  get absenceEmpForm() { return this.absenceFormGroup.controls; }

  cancel() {
    this.onCancel.emit()
  }

  editLeave() {

    this.updateLeaveIsSubmitted = true
    if (this.absenceFormGroup.invalid) return;
    this.isLeaveLoading = true

    const body = {
      idUser: this.idUser,
      leaveType: "ANNUAL",
      daysRequested: (this.absenceFormGroup.value.absenceRangeDate[1].getTime() - this.absenceFormGroup.value.absenceRangeDate[0].getTime()) / (1000 * 60 * 60 * 24),
      startLeave: this.absenceFormGroup.value.absenceRangeDate[0].getTime(),
      endLeave: this.absenceFormGroup.value.absenceRangeDate[1].getTime()
    }
    
    this.employeeService.editLeave(body, this.idLeave ?? "").subscribe({
      next: (value) => {

        console.log(value.body)

        if (value.body.response) {
          this.onSuccess.emit()
        } else {
          this.onError.emit()
        }

        this.isLeaveLoading = false

      }, error: (err) => {
        console.log(err)
        this.isLeaveLoading = false
        this.onError.emit()

      }
    })

  }

}
