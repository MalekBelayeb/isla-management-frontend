import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  input,
} from '@angular/core';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css',
})
export class DateRangePickerComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {}
  focus1: boolean = false;
  focus2: boolean = false;
  @Input() startDatePrefix = 'Date de début';
  @Input() endDatePrefix = 'Date de fin';
  @Input() isTodayMinDate: boolean = false;
  @Input() startDateInvalid: boolean = false;
  @Input() startDateErrorMessage: string = '';
  @Input() endDateInvalid: boolean = false;
  @Input() endDateErrorMessage: string = '';

  @Input() useSingleInputDate: boolean = false;

  @Input() startDateValue?: Date;
  @Input() endDateValue?: Date;

  @Output() startDate = new EventEmitter<Date>();
  @Output() endDate = new EventEmitter<Date>();

  id: string = '';
  constructor() {
    this.id = this.generateRandomString();
  }
  generateRandomString(length: number = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }
  ngAfterViewInit(): void {
    if (this.isTodayMinDate) {
      this.setTodayMinDate();
      this.startDate.emit(new Date());
    }
  }
  onChangeStartDate() {
    if (this.useSingleInputDate) return;
    const endDateElem = document.getElementById(
      `endDateInput-${this.id}`,
    ) as HTMLInputElement;
    endDateElem.value = '';
    this.endDate.emit(undefined);
  }

  setTodayMinDate() {
    console.log(`startDateInput-${this.id}`);
    const startDateElem = document.getElementById(
      `startDateInput-${this.id}`,
    ) as HTMLInputElement;
    const endDateElem = document.getElementById(
      `endDateInput-${this.id}`,
    ) as HTMLInputElement;
    startDateElem.min = new Date().toISOString().split('T')[0];
    startDateElem.value = new Date().toISOString().split('T')[0];

    endDateElem.min = startDateElem.min;
  }
  onChangeDatepicker() {
    const startDateElem = document.getElementById(
      `startDateInput-${this.id}`,
    ) as HTMLInputElement;
    const startDate = new Date(startDateElem.value).toISOString().split('T')[0];
    this.startDate.emit(new Date(startDate));
    if (this.useSingleInputDate) return;

    const endDateElem = document.getElementById(
      `endDateInput-${this.id}`,
    ) as HTMLInputElement;
    if (startDateElem) {
      endDateElem.min = new Date(startDateElem.value)
        .toISOString()
        .split('T')[0];
    }
    if (!startDateElem.value || !endDateElem.value) return;
    const endDate = new Date(endDateElem.value).toISOString().split('T')[0];
    this.endDate.emit(new Date(endDate));
  }

  openDatePicker(id: string) {
    console.log(id + `-` + this.id);
    if (id === `startDateInput`) this.focus1 = true;
    if (id === `endDateInput`) this.focus2 = true;
    const input = document.getElementById(
      id + `-` + this.id,
    ) as HTMLInputElement;
    input?.showPicker();
  }
}
