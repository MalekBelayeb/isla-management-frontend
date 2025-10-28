import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import noUiSlider from 'nouislider';

@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.css',
})
export class InputSliderComponent implements OnInit {
  @Input() startValue: number = 0;
  @Input() initialMinValue: number = 0;
  @Input() step: number = 1;
  @Input({ required: true }) maxValue: number = 0;
  @Input() truncateValue: Boolean = false;
  @Output() currentValue = new EventEmitter<number>();
  ngOnInit(): void {
    var c: any = document.getElementById('input-slider');
    var dMin = document.getElementById('input-slider-min-value');
    var dMax = document.getElementById('input-slider-max-value');
    var dCurrent = document.getElementById('input-slider-current-value');
    noUiSlider.create(c, {
      start: this.startValue,
      connect: [true, false],
      step: this.step,
      range: {
        min: this.initialMinValue,
        max: this.maxValue,
      },
    });
    c.noUiSlider.on('update', (a: any, b: any) => {
      if (!dMax || !dMin || !dCurrent) return;
      dMax.textContent = `${this.maxValue}`;
      dMin.textContent = `0`;

      dCurrent.textContent = `${Math.trunc(a[b])}/${Math.trunc(this.maxValue)}`;

      this.currentValue.emit(a[b]);
    });
  }
}
